import { CONSTANTS as CONST } from '../../utils/constants/constants.js'
import { readJSON, writeJSON, generateId, validateFields } from '../../utils/functions/functions.js'
import { productManager } from '../products/productsServices.js'

class CartsManager {
    constructor(path) {
        this.path = path
    }

    create(body) {
        const cid = generateId()
        const carts = readJSON(this.path)
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
                    msg = `El campo: '${isBodyValid.fieldsInvalid[0]}' estaba de más para el productoId '${item.productId}'.`
                } else {
                    msg = `Los campos: ${isBodyValid.fieldsInvalid.map(f => `'${f}'`).join(", ")} estaban de más para el productoId '${item.productId}'.`
                }
                extraFieldsMessages.push(msg)
            }
            if (!isBodyValid.objectValid) {
                let customMsg = ''
                if (isBodyValid.fieldsMissing.length > 0) {
                    customMsg += `Faltan campos: ${isBodyValid.fieldsMissing.map(field => `'${field}'`).join(", ")}. `
                }
                if (isBodyValid.fieldsTypeError.length > 0) {
                    customMsg += `Campos con tipo incorrecto: ${isBodyValid.fieldsTypeError.map(field => `'${field}'`).join(", ")}. `
                }
                errors.push({ item, message: customMsg.trim() })
                continue
            }
            const { productId, quantity } = item
            if (!Number.isInteger(quantity) || quantity <= 0) {
                errors.push({ item, message: `Cantidad inválida para el producto ${productId}. Debe ser un entero mayor a 0.` })
                continue
            }
            try {
                const product = productManager.getById(productId)
                if (!productsMap[productId]) {
                    productsMap[productId] = {
                        productId: product.id,
                        title: product.title,
                        price: product.price,
                        quantity: quantity
                    }
                } else {
                    productsMap[productId].quantity += quantity
                }
            } catch (err) {
                errors.push({ item, message: `Producto con id ${productId} no encontrado.` })
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
            id: cid,
            products: Object.values(productsMap)
        }
        carts.push(newCart)
        writeJSON(this.path, carts)
        if (extraFieldsMessages.length > 0) {
            return {
                success: true,
                message: "Carrito creado satisfactoriamente!!!; " + extraFieldsMessages.join(" "),
                cart: newCart
            }
        }
        return {
            success: true,
            message: "Carrito creado satisfactoriamente!!!",
            cart: newCart
        }
    }

    getProductsByCartId(id) {
        return {
            success: true,
            message: `Productos del carrito ${id}`,
            products: []
        }
    }

    addProductToCart(cid, pid) {
        const productToAdd = { product: pid, quantity: 1 }
        return {
            success: true,
            message: `Producto ${pid} agregado al carrito ${cid}`,
            addedProduct: productToAdd
        }
    }
}

export const cartsManager = new CartsManager("src/db/carts/carts.json")