import { Router } from 'express'
import { cartsManager } from './cartsServices.js'

const router = Router()

// Crear un nuevo carrito
router.post('/', (req, res) => {
    const result = cartsManager.create(req.body)
    if (result.success) {
        res.status(201).json(result)
    } else {
        res.status(400).json(result)
    }
})

// Listar los productos de un carrito por su id
router.get(`/:id`, (req, res) => {
    try {
        const result = cartsManager.getProductsByCartId(req.params.id)
        res.status(200).json(result)
    } catch (err) {
        if (err.details) {
            res.status(404).json(err.details)
        } else {
            res.status(404).json({ error: err.message })
        }
    }
})

// Agregar un producto al carrito seleccionado.
router.post(`/:cid/product/:pid`, (req, res) => {
    try {
        const result = cartsManager.addProductToCart(req.params.cid, req.params.pid, req.body)
        if (result.success) {
            res.status(200).json(result)
        } else {
            res.status(400).json(result)
        }
    } catch (err) {
        if (err.details) {
            res.status(404).json(err.details)
        } else {
            res.status(404).json({ error: err.message })
        }
    }
})

export default router