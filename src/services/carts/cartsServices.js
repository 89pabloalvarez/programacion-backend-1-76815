import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { CONSTANTS as CONST } from '../../utils/constants/constants.js'

class CartsManager {
    constructor(path) {
        this.path = path
    }

    createCart() {
        const cid = uuidv4()
        const newCart = { id: cid, products: [] }

        return {
            success: true,
            message: "Carrito creado satisfactoriamente",
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