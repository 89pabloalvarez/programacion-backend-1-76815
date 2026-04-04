import { Router } from 'express'
import { cartsController } from '../controllers/carts.js'

const router = Router()

// Obtener todos los carritos.
router.get('/', cartsController.getAll)

// Obtener un carrito por ID.
router.get('/:id', cartsController.getById)

// Crea un nuevo carrito.
router.post('/', cartsController.create)

// Agregar producto al carrito.
router.put('/:cid/product/:pid', cartsController.addProduct)

export default router