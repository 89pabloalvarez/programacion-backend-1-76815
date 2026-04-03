import { CONSTANTS as CONST } from '../common/constants.js'
import { validateFields } from '../common/functions.js'
import { cartsRepository } from '../repositories/carts.js'
import { productsRepository } from '../repositories/products.js'
import { CartModel } from '../models/cart.js'
import mongoose from 'mongoose'

class CartsService {
  constructor(cartsRepo, productsRepo) {
    this.cartsRepo = cartsRepo
    this.productsRepo = productsRepo
  }

  // Obtener todos los carritos.
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

  // Obtener un carrito por ID.
  async getById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error(CONST.BAD_ID)
      err.statusCode = 400
      err.details = { providedId: id, message: CONST.BAD_ID }
      throw err
    }
    const cart = await this.cartsRepo.getById(id)
    if (!cart) {
      const err = new Error(CONST.PURCHASE_NOT_FOUND)
      err.statusCode = 404
      err.details = { searchedCart: id, message: CONST.PURCHASE_NOT_FOUND }
      throw err
    }
    return cart
  }

  // Crea un nuevo carrito.
  async create(body) {
    if (!Array.isArray(body)) {
      return { success: false, message: "El body debe ser un array de productos." }
    }

    const productsMap = {}
    const extraFieldsMessages = []
    const errors = []

    for (const item of body) {
      const validationResult = this.validateCartItem(item)
      if (validationResult.error) {
        errors.push({ item, message: validationResult.error })
        continue
      }
      if (validationResult.extraFieldsMsg) {
        extraFieldsMessages.push(validationResult.extraFieldsMsg)
      }

      // 2. Validar cantidad
      const quantityError = this.validateQuantity(item)
      if (quantityError) {
        errors.push({ item, message: quantityError })
        continue
      }

      const product = await this.productsRepo.getById(item.productId)
      if (!product) {
        errors.push({ item, message: `Producto con id ${item.productId} no encontrado.` })
        continue
      }

      this.addOrUpdateCartProduct(productsMap, product, item.quantity)
    }

    if (errors.length > 0) {
      return { success: false, message: "Errores en la creación del carrito.", errors }
    }

    const newCart = { products: Object.values(productsMap) }
    const createdCart = await this.cartsRepo.create(newCart)

    if (extraFieldsMessages.length > 0) {
      const populatedCart = await CartModel.findById(createdCart._id)
      return {
        success: true,
        message: "Carrito creado satisfactoriamente. " + extraFieldsMessages.join(" "),
        cart: populatedCart
      }
    }

    return { success: true, message: "Carrito creado satisfactoriamente.", cart: createdCart }
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

  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////FUNCIONES AUXILIARES////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////

  validateCartItem(item) {
    const result = validateFields(item, CONST.CART_CREATE_ALLOWED_FIELDS, CONST.CART_FIELDS_SCHEMA)

    if (!result.objectValid) {
      let msg = ''
      if (result.fieldsMissing.length > 0) {
        msg += `Faltan campos: ${result.fieldsMissing.map(f => `'${f}'`).join(", ")}. `
      }
      if (result.fieldsTypeError.length > 0) {
        msg += `Campos con tipo incorrecto: ${result.fieldsTypeError.map(f => `'${f}'`).join(", ")}.`
      }
      return { error: msg.trim() }
    }

    if (result.fieldsInvalid.length > 0) {
      const msg = result.fieldsInvalid.length === 1
        ? `El campo '${result.fieldsInvalid[0]}' estaba de más para el productoId '${item.productId}'.`
        : `Los campos ${result.fieldsInvalid.map(f => `'${f}'`).join(", ")} estaban de más para el productoId '${item.productId}'.`
      return { extraFieldsMsg: msg }
    }

    return {}
  }

  validateQuantity(item) {
    const { productId, quantity } = item
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return `Cantidad inválida para el producto ${productId}. Debe ser un entero mayor a 0.`
    }
    return null
  }

  addOrUpdateCartProduct(productsMap, product, quantity) {
    if (!productsMap[product._id]) {
      productsMap[product._id] = {
        product: product._id,
        title: product.title,
        price: product.price,
        quantity
      }
    } else {
      productsMap[product._id].quantity += quantity
    }
  }

}

export const cartsService = new CartsService(
  cartsRepository,
  productsRepository
)