import { CONSTANTS as CONST } from '../common/constants.js'
import { validateFields } from '../common/functions.js'
import { productsRepository } from '../repositories/products.js'

class ProductsService {
  constructor(repo) {
    this.repo = repo
  }

  async getAll(params) {
    return await this.repo.getAll(params)
  }

  async getById(id) {
    const product = await this.repo.getById(id)
    if (!product) {
      const err = new Error(CONST.PRODUCT_NOT_FOUND)
      err.details = { searchedProduct: id, message: CONST.PRODUCT_NOT_FOUND }
      throw err
    }
    return product
  }

  async create(body) {
    const isBodyValid = validateFields(
      body,
      CONST.PRODUCT_CREATE_ALLOWED_FIELDS,
      CONST.PRODUCT_FIELDS_SCHEMA
    )

    if (!isBodyValid.objectValid) {
      throw new Error('Validación fallida: ' + JSON.stringify(isBodyValid))
    }

    return await this.repo.create(body)
  }

  async update(id, data) {
    const isBodyValid = validateFields(
      data,
      CONST.PRODUCT_EDIT_ALLOWED_FIELDS,
      CONST.PRODUCT_FIELDS_SCHEMA
    )

    if (!isBodyValid.objectValid) {
      throw new Error('Validación fallida: ' + JSON.stringify(isBodyValid))
    }

    return await this.repo.update(id, data)
  }

  async delete(id) {
    const product = await this.repo.delete(id)
    if (!product) {
      const err = new Error(CONST.PRODUCT_NOT_FOUND)
      err.details = { searchedProduct: id, message: CONST.PRODUCT_NOT_FOUND }
      throw err
    }
    return product
  }
}

export const productsService = new ProductsService(productsRepository)