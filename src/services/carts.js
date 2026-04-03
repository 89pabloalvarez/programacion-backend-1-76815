import { CONSTANTS as CONST } from '../common/constants.js'
import { validateFields } from '../common/functions.js'
import { cartsRepository } from '../repositories/carts.js'
import { productsRepository } from '../repositories/products.js'
import { CartModel } from '../models/cart.js'

class CartsService {
  constructor(cartsRepo, productsRepo) {
    this.cartsRepo = cartsRepo
    this.productsRepo = productsRepo
  }

  async getAll({ limit = 10, page = 1, sort, query }) {
    const filter = query ? { category: query } : {}
    const sortOption = sort ? { price: sort === 'asc' ? 1 : -1 } : {}

    return await this.cartsRepo.getAll(filter, {
      page,
      limit,
      sort: sortOption,
      lean: true
    })
  }

  async create(body) {
    if (!Array.isArray(body)) {
      return {
        success: false,
        message: "El body debe ser un array de productos."
      }
    }

    const productsMap = {}
    const extraFieldsMessages = []
    const errors = []

    for (const item of body) {
      const isBodyValid = validateFields(
        item,
        CONST.CART_CREATE_ALLOWED_FIELDS,
        CONST.CART_FIELDS_SCHEMA
      )

      if (isBodyValid.fieldsInvalid.length > 0) {
        let msg = ''
        if (isBodyValid.fieldsInvalid.length === 1) {
          msg = `El campo '${isBodyValid.fieldsInvalid[0]}' estaba de más para el productoId '${item.productId}'.`
        } else {
          msg = `Los campos ${isBodyValid.fieldsInvalid.map(f => `'${f}'`).join(", ")} estaban de más para el productoId '${item.productId}'.`
        }
        extraFieldsMessages.push(msg)
      }

      if (!isBodyValid.objectValid) {
        let customMsg = ''

        if (isBodyValid.fieldsMissing.length > 0) {
          customMsg += `Faltan campos: ${isBodyValid.fieldsMissing.map(f => `'${f}'`).join(", ")}. `
        }

        if (isBodyValid.fieldsTypeError.length > 0) {
          customMsg += `Campos con tipo incorrecto: ${isBodyValid.fieldsTypeError.map(f => `'${f}'`).join(", ")}.`
        }

        errors.push({
          item,
          message: customMsg.trim()
        })
        continue
      }

      const { productId, quantity } = item

      if (!Number.isInteger(quantity) || quantity <= 0) {
        errors.push({
          item,
          message: `Cantidad inválida para el producto ${productId}. Debe ser un entero mayor a 0.`
        })
        continue
      }

      const product = await this.productsRepo.getById(productId)

      if (!product) {
        errors.push({
          item,
          message: `Producto con id ${productId} no encontrado.`
        })
        continue
      }

      if (!productsMap[productId]) {
        productsMap[productId] = {
          product: productId,
          title: product.title,
          price: product.price,
          quantity
        }
      } else {
        productsMap[productId].quantity += quantity
      }
    }

    if (errors.length > 0) {
      return {
        success: false,
        message: "Errores en la creación del carrito.",
        errors
      }
    }

    const newCart = {
      products: Object.values(productsMap)
    }

    const createdCart = await this.cartsRepo.create(newCart)


    if (extraFieldsMessages.length > 0) {
      const populatedCart = await CartModel.findById(createdCart._id)
      return {
        success: true,
        message: "Carrito creado satisfactoriamente. " + extraFieldsMessages.join(" "),
        cart: populatedCart
      }
    }

    return {
      success: true,
      message: "Carrito creado satisfactoriamente.",
      cart: createdCart
    }
  }

  async getById(id) {
    const cart = await this.cartsRepo.getById(id)

    if (!cart) {
      const err = new Error(CONST.PURCHASE_NOT_FOUND)
      err.details = {
        success: false,
        searchedCart: id,
        message: CONST.PURCHASE_NOT_FOUND
      }
      throw err
    }

    return {
      success: true,
      message: `Productos del carrito ${id}`,
      products: cart.products.map(p => p.product)
    }
  }

  async addProduct(cid, pid, quantity) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return {
        success: false,
        message: `Cantidad inválida para el producto ${pid}.`
      }
    }

    const product = await this.productsRepo.getById(pid)

    if (!product) {
      return {
        success: false,
        message: `Producto con id ${pid} no encontrado.`
      }
    }

    const cart = await this.cartsRepo.getById(cid)

    if (!cart) {
      const err = new Error(CONST.PURCHASE_NOT_FOUND)
      err.details = {
        success: false,
        searchedCart: cid,
        message: CONST.PURCHASE_NOT_FOUND
      }
      throw err
    }

    const existingProduct = cart.products.find(
      p => p.product.toString() === pid
    )

    if (existingProduct) {
      existingProduct.quantity += quantity
    } else {
      cart.products.push({
        product: pid,
        title: product.title,
        price: product.price,
        quantity
      })
    }

    return await this.cartsRepo.update(cid, cart)
  }
}

export const cartsService = new CartsService(
  cartsRepository,
  productsRepository
)