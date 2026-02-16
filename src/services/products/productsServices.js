import { CONSTANTS as CONST } from '../../utils/constants/constants.js'
import { readJSON, writeJSON, generateId, validateFields } from '../../utils/functions/functions.js'

class ProductManager {
    constructor(path) {
        this.path = path
    }

    getAll() {
        return readJSON(this.path)
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
        const pid = generateId()
        const newProduct = {
            id: pid,
            code: pid.replace(/-/g, ""),
            status: true,
            ...body
        }
        const isBodyValid = validateFields(
            newProduct,
            CONST.PRODUCT_CREATE_ALLOWED_FIELDS,
            CONST.PRODUCT_FIELDS_SCHEMA
        )
        const filteredProduct = {}
        for (const key of CONST.PRODUCT_CREATE_ALLOWED_FIELDS) {
            if (newProduct.hasOwnProperty(key)) {
                filteredProduct[key] = newProduct[key]
            }
        }
        if (isBodyValid.objectValid) {
            const products = this.getAll()
            products.push(filteredProduct)
            writeJSON(this.path, products)
            if (isBodyValid.fieldsInvalid.length > 0) {
                let customMsg = ''
                if (isBodyValid.fieldsInvalid.length == 1){
                    customMsg = `El campo: '${isBodyValid.fieldsInvalid}' está de más.`
                } else {
                    customMsg = `Los campos: ${isBodyValid.fieldsInvalid.map(field => `'${field}'`).join(", ")} están de más.`
                }
                return {
                    success: true,
                    message: 'Producto creado satisfactoriamente!!!; ' + customMsg,
                    product: filteredProduct
                }
            }
            return {
                success: true,
                message: "Producto creado satisfactoriamente!!!",
                product: filteredProduct
            }
        } else {
            let customMsg2 = ''
            if (isBodyValid.fieldsMissing.length === 1) {
                customMsg2 = `Te falta el campo: '${isBodyValid.fieldsMissing[0]}'.`
            } else if (isBodyValid.fieldsMissing.length > 1) {
                customMsg2 = `Te faltan los campos: ${isBodyValid.fieldsMissing.map(f => `'${f}'`).join(", ")}.`
            }
            if (isBodyValid.fieldsInvalid.length === 1) {
                customMsg2 += ` Además, el campo: '${isBodyValid.fieldsInvalid[0]}' está de más.`
            } else if (isBodyValid.fieldsInvalid.length > 1) {
                customMsg2 += ` Además, los campos: ${isBodyValid.fieldsInvalid.map(f => `'${f}'`).join(", ")} están de más.`
            }
            if (isBodyValid.fieldsTypeError.length === 1) {
                const field = isBodyValid.fieldsTypeError[0]
                customMsg2 += ` El campo: '${field}' tiene formato incorrecto, debería ser de tipo '${CONST.PRODUCT_FIELDS_SCHEMA[field]}'.`
            } else if (isBodyValid.fieldsTypeError.length > 1) {
                const fields = isBodyValid.fieldsTypeError.map(f => `'${f}'`).join(", ")
                customMsg2 += ` Los campos: ${fields} tienen un formato incorrecto.`
                customMsg2 += " Tipos esperados: " + isBodyValid.fieldsTypeError.map(f => `'${f}': ${CONST.PRODUCT_FIELDS_SCHEMA[f]}`).join(", ")
            }

            return {
                success: false,
                message: customMsg2,
                errors: {
                    fieldsMissing: isBodyValid.fieldsMissing,
                    fieldsInvalid: isBodyValid.fieldsInvalid,
                    fieldsTypeError: isBodyValid.fieldsTypeError
                }
            }
        }
    }

    update(id, prodEdited) {
        const products = this.getAll();
        const index = products.findIndex(p => p.id === id)
        if (index === -1) {
            return {
                success: false,
                message: `Error al editar el producto. ${CONST.PRODUCT_NOT_FOUND}`,
                errors: { id }
            }
        }
        const isBodyValid = validateFields(
            prodEdited,
            CONST.PRODUCT_EDIT_ALLOWED_FIELDS,
            CONST.PRODUCT_FIELDS_SCHEMA
        )
        const safeUpdate = {}
        for (const key of CONST.PRODUCT_EDIT_ALLOWED_FIELDS) {
            if (prodEdited.hasOwnProperty(key)) {
                safeUpdate[key] = prodEdited[key]
            }
        }
        if (isBodyValid.objectValid) {
            products[index] = { ...products[index], ...safeUpdate };
            writeJSON(this.path, products)
            if (isBodyValid.fieldsInvalid.length > 0) {
                let customMsg = ''
                if (isBodyValid.fieldsInvalid.length === 1) {
                    customMsg = `El campo: '${isBodyValid.fieldsInvalid[0]}' está de más.`
                } else {
                    customMsg = `Los campos: ${isBodyValid.fieldsInvalid.map(f => `'${f}'`).join(", ")} están de más.`
                }
                return {
                    success: true,
                    message: 'Producto actualizado satisfactoriamente!!!; ' + customMsg,
                    product: products[index]
                }
            }
            return {
                success: true,
                message: "Producto actualizado satisfactoriamente!!!",
                product: products[index]
            }
        } else {
            let customMsg2 = ''
            if (isBodyValid.fieldsMissing.length === 1) {
                customMsg2 = `Te falta el campo: '${isBodyValid.fieldsMissing[0]}'.`
            } else if (isBodyValid.fieldsMissing.length > 1) {
                customMsg2 = `Te faltan los campos: ${isBodyValid.fieldsMissing.map(f => `'${f}'`).join(", ")}.`
            }
            if (isBodyValid.fieldsInvalid.length === 1) {
                customMsg2 += ` Además, el campo: '${isBodyValid.fieldsInvalid[0]}' está de más.`
            } else if (isBodyValid.fieldsInvalid.length > 1) {
                customMsg2 += ` Además, los campos: ${isBodyValid.fieldsInvalid.map(f => `'${f}'`).join(", ")} están de más.`
            }
            if (isBodyValid.fieldsTypeError.length === 1) {
                const field = isBodyValid.fieldsTypeError[0]
                customMsg2 += ` El campo: '${field}' tiene un formato incorrecto, debería ser de tipo '${CONST.PRODUCT_FIELDS_SCHEMA[field]}'.`
            } else if (isBodyValid.fieldsTypeError.length > 1) {
                const fields = isBodyValid.fieldsTypeError.map(f => `'${f}'`).join(", ")
                customMsg2 += ` Los campos: ${fields} tienen un formato incorrecto. Tipos esperados: ${isBodyValid.fieldsTypeError.map(f => `'${f}': ${CONST.PRODUCT_FIELDS_SCHEMA[f]}`).join(", ")}`
            }

            return {
                success: false,
                message: customMsg2,
                errors: {
                    fieldsMissing: isBodyValid.fieldsMissing,
                    fieldsInvalid: isBodyValid.fieldsInvalid,
                    fieldsTypeError: isBodyValid.fieldsTypeError
                }
            }
        }
    }

    delete(id) {
        const products = this.getAll()
        const index = products.findIndex(p => p.id === id)
        if (index === -1) {
            const err = new Error(CONST.PRODUCT_NOT_FOUND)
            err.details = {
                success: false,
                searchedProduct: id,
                message: 'No se pudo eliminar el producto.',
                reason: CONST.PRODUCT_NOT_FOUND
            }
            throw err
        }
        const productDeleted = products[index]
        products.splice(index, 1)
        writeJSON(this.path, products)
        return {
            success: true,
            searchedProduct: id,
            message: 'Producto eliminado correctamente!!!',
            deletedProduct: productDeleted
        }
    }
}

export const productManager = new ProductManager("src/db/products/products.json")