import { Router } from 'express'
import { productsService } from '../services/products.js'

const router = Router()

router.get("/", async (req, res) => {
  const products = await productsService.getAll();
  res.render('pages/home', { page_title: 'Inicio', products })
})

router.get('/realtimeproducts', (req, res) => {
    res.render('pages/realTimeProducts', { page_title: 'Productos en Tiempo Real' })
})

export default router