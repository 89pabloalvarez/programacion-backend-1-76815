import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { CONSTANTS as CONST } from '../../utils/constants/constants.js'
import { validateFields } from '../../utils/functions/functions.js'

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
        const pid = uuidv4();
        const product = {
            id: pid,
            code: pid.replace(/-/g, ""),
            status: true,
            ...body
        }
        const isBodyValid = validateFields(body, CONST.PRODUCT_CREATE_ALLOWED_FIELDS)
        if (isBodyValid.objectValid) {
            const products = this.getAll()
            products.push(product)
            fs.writeFileSync(this.path, JSON.stringify(products, null, 2))
            if (isBodyValid.fieldsInvalid.length > 0) {
                return {
                    message: `Producto creado satisfactoriamente!!!; Los campos: ${isBodyValid.fieldsInvalid.join(", ")} están de más.`,
                    product
                }
            }
            return {
                message: "Producto creado correctamente.",
                product
            }
        } else {
            throw new Error(
                `Error al crear el producto :(. Te faltan los campos: ${isBodyValid.fieldsEmpty.join(", ")}.`
                + (isBodyValid.fieldsInvalid.length > 0
                    ? ` Y además me mandaste campos: ${isBodyValid.fieldsInvalid.join(", ")} que están de más.`
                    : "")
            )
        }
    }

    update(id, prodEdited) {
        const products = this.getAll()
        const index = products.findIndex(p => p.id === id)
        if (index === -1) throw new Error(`Error al editar el producto. ${CONST.PRODUCT_NOT_FOUND}`)
          const safeUpdate = {};
        for (const key of CONST.PRODUCT_EDIT_ALLOWED_FIELDS) {
            if (prodEdited.hasOwnProperty(key)) {
            safeUpdate[key] = prodEdited[key];
            }
        }
        products[index] = { ...products[index], ...prodEdited };
        fs.writeFileSync(this.path, JSON.stringify(products, null, 2))
        return products[index]
    }

    delete(id) {
        const products = this.getAll()
        const index = products.findIndex(p => p.id === id)
        if (index === -1) throw new Error(`Error al eliminar el producto. ${CONST.PRODUCT_NOT_FOUND}`)
        const deleted = products[index]
        products.splice(index, 1)
        fs.writeFileSync(this.path, JSON.stringify(products, null, 2))
        return deleted
    }
}

export const productManager = new ProductManager("src/db/products/products.json")