import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { CONSTANTS as CONST } from '../../utils/constants/constants.js'

class ProductManager {
    constructor(path) {
        this.path = path
    }

    getAll() {
        if (fs.existsSync(this.path)) {
            const productsFile = fs.readFileSync(this.path, 'utf-8')
            return JSON.parse(productsFile)
        }
        return []
    }

    getById(id) {
        const products = this.getAll()
        const product = products.find(p => p.id === id)
        if (!product) {
            const err = new Error(CONST.PRODUCT_NOT_FOUND)
            err.details = { searchedProduct: id, message: CONST.PRODUCT_NOT_FOUND }
            throw err
        }
        return product
    }

    create(body) {
        const pid = uuidv4()
        const product = {
            id: pid,
            code: pid.replace(/-/g, ""),
            status: true,
            ...body
        }
        const products = this.getAll()
        products.push(product)
        fs.writeFileSync(this.path, JSON.stringify(products, null, 2))
        return product
    }

    update(id, updated) {
        const products = this.getAll()
        const index = products.findIndex(p => p.id === id)
        if (index === -1) throw new Error(CONST.PRODUCT_NOT_FOUND)
        products[index] = { ...products[index], ...updated };
        fs.writeFileSync(this.path, JSON.stringify(products, null, 2))
        return products[index]
    }

    delete(id) {
        const products = this.getAll()
        const index = products.findIndex(p => p.id === id)
        if (index === -1) throw new Error(CONST.PRODUCT_NOT_FOUND)
        const deleted = products[index]
        products.splice(index, 1)
        fs.writeFileSync(this.path, JSON.stringify(products, null, 2))
        return deleted
    }
}

export const productManager = new ProductManager("src/db/products/products.json")