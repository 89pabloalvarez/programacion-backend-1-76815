import { Router } from 'express'
import { CONSTANTS as CONST } from '../utils/constants/constants.js'
import productsRouter from './products/products-router.js'
import cartsRouter from './carts/carts-router.js'

const router = Router()

router.use(CONST.DIR_URL_PRODUCTS, productsRouter)
router.use(CONST.DIR_URL_CARTS, cartsRouter)

export default router