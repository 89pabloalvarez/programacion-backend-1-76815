import { Router } from 'express'
import { productsService } from '../services/products.js'

const router = Router()

router.get("/", async (req, res) => {
  let products = await productsService.getAllWithoutPagination({})
  // const products = await productsService.getAll({}) En el caso de usar paginación se descomenta ésta linea y la 12 y listooo!!
  // Devolveríííía los 10 primeros, pero como la parte de la view en websocket no manejo paginado, que quede como estaba originalmente. en la entrega 2. (ésto no se evalúa en la entrega final)
  products = products.map(p => ({
    ...p,
    status: p.status ? 'Si' : 'No'
  }))
  res.render('pages/home', { 
    page_title: 'Inicio',
    products
    // products: products.docs 
  })
})

router.get('/realtimeproducts', (req, res) => {
    res.render('pages/realTimeProducts', { page_title: 'Productos en Tiempo Real' })
})

export default router