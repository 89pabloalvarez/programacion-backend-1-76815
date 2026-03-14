import { Router } from "express"
import { productManager } from './productsServices.js'

const router = Router()

//Obtener todos los productos.
router.get('/', (req, res) => res.json(productManager.getAll()))

//Obtener un producto filtrando por su id.
router.get(`/:id`, (req, res) => {
    try {
        res.json(productManager.getById(req.params.id))
    } catch (err) {
        if (err.details) {
            res.status(404).json(err.details)
        } else {
            res.status(404).json({ error: err.message })
        }
    }
})

//Crear un nuevo producto.
router.post('/', (req, res) => {
  const result = productManager.create(req.body)
  if (result.success) {
    res.status(200).json(result)
  } else {
    res.status(400).json(result)
  }
})

//Actualizar un producto obtenido por su ID.
router.put(`/:id`, (req, res) => {
    const result = productManager.update(req.params.id, req.body)
    if (result.success) {
        res.status(200).json(result)
    } else {
        res.status(400).json(result)
    }
})

//Eliminar un producto por su ID.
router.delete(`/:id`, (req, res) => {
    try {
        res.json(productManager.delete(req.params.id))
    } catch (err) {
        if (err.details) {
            res.status(404).json(err.details)
        } else {
            res.status(404).json({ error: err.message })
        }
    }
})

export default router