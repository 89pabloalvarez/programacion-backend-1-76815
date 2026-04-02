import { cartsService } from '../services/carts.js'

class CartsController {
  constructor(service) {
    this.service = service
  }

  // Obtener todos los carritos
  getAll = async (req, res, next) => {
    try {
      const response = await this.service.getAll()
      res.json(response)
    } catch (error) {
      next(error)
    }
  }

  // Obtener carrito por ID
  getById = async (req, res, next) => {
    try {
      const { id } = req.params
      const response = await this.service.getById(id)
      res.json(response)
    } catch (error) {
      next(error)
    }
  }

  // Crear carrito
  create = async (req, res, next) => {
    try {
      const response = await this.service.create(req.body)
      res.status(201).json(response)
    } catch (error) {
      next(error)
    }
  }

  // Agregar producto a carrito
  addProduct = async (req, res, next) => {
    try {
      const { cid, pid } = req.params
      const { quantity } = req.body

      const response = await this.service.addProduct(cid, pid, quantity)
      res.json(response)
    } catch (error) {
      next(error)
    }
  }
}

export const cartsController = new CartsController(cartsService)