import { Router } from 'express'
import { productsService } from '../services/products.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    let { page = 1, limit = 10 } = req.query
 
    page  = parseInt(page)
    limit = parseInt(limit)

    if (isNaN(page)  || page  < 1) page  = 1
    if (isNaN(limit) || limit < 1) limit = 10
    if (limit > 100) limit = 100 // Meto ésta validacion para que nadie se vaya a la goma con el límite, ya es hilar muuuuy fino pero puede pasar!
 
    const result = await productsService.getAll({ page, limit })
 
    if (page > result.totalPages && result.totalPages > 0) {
      return res.redirect(`/?page=${result.totalPages}&limit=${limit}`)
    }
 
    const products = (result.docs || []).map(p => ({
      ...p,
      status: p.status ? 'Si' : 'No'
    }))
 
    res.render('pages/home', {
      page_title: 'Inicio',
      products,
      pagination: {
        page:        result.page,
        totalPages:  result.totalPages,
        totalDocs:   result.totalDocs,
        limit:       result.limit,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage:    result.prevPage,
        nextPage:    result.nextPage,
        isEmpty:     products.length === 0
      }
    })
  } catch (error) {
    next(error)
  }
})
 
router.get('/realtimeproducts', (req, res) => {
  res.render('pages/realTimeProducts', { page_title: 'Productos en Tiempo Real' })
})

export default router