import { Router } from 'express'
import { productsService } from '../services/products.js'

const router = Router()

router.get("/", async (req, res) => {
  let products = await productsService.getAll({ limit: 10, page: 1 })
  res.render('pages/home', { 
    page_title: 'Inicio',
    products: products.docs.map(p => ({
      ...p,
      status: p.status ? 'Si' : 'No'
    }))
  })
})

router.get('/realtimeproducts', (req, res) => {
    res.render('pages/realTimeProducts', { page_title: 'Productos en Tiempo Real' })
})

export default router