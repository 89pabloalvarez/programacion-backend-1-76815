import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
    res.render('pages/home', { page_title: 'Inicio' })
})

router.get('/realtimeproducts', (req, res) => {
    res.render('pages/realTimeProducts', { page_title: 'Productos en Tiempo Real' })
})

export default router