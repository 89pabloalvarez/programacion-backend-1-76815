import { productsService } from '../services/products.js'

export default function registerProductSockets(io) {
  io.on('connection', async (socket) => {
    console.log(`Usuario conectado: ${socket.id}`)

    const products = await productsService.getAll({ limit: 10, page: 1 })
    socket.emit('updateProducts', products)

    socket.on('addProduct', async (body) => {
      try {
        await productsService.create(body)
        io.emit('updateProducts', await productsService.getAll({ limit: 10, page: 1 }))
      } catch (error) {
        socket.emit('error', { message: error.message })
      }
    })

    socket.on('deleteProduct', async (productToDelete) => {
      try {
        await productsService.delete(productToDelete)
        io.emit('updateProducts', await productsService.getAll({ limit: 10, page: 1 }))
      } catch (error) {
        socket.emit('error', { message: error.message })
      }
    })

    socket.on('getProducts', async ({ page, limit }) => {
      try {
        const products = await productsService.getAll({ page, limit })
        socket.emit('updateProducts', products)
      } catch (error) {
        socket.emit('error', { message: error.message })
      }
    })

    socket.on('disconnect', () => {
      console.log(`Usuario desconectado: ${socket.id}`)
    })
  })
}