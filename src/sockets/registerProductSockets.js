import { productsService } from '../services/products.js'

export default function registerProductSockets(io) {

    io.on('connection', (socket) => {
        console.log(`Usuario conectado: ${socket.id}`)

        socket.emit('updateProducts', productsService.getAll())

        socket.on('addProduct', (body) => {
            const result = productsService.create(body)
            if (result.success) {
                io.emit('updateProducts', productsService.getAll())
            } else {
                socket.emit('error', result.message)
            }
        })

        socket.on('deleteProduct', (productToDelete) => {
            const result = productsService.delete(productToDelete)
            if (result.success) {
                io.emit('updateProducts', productsService.getAll())
            } else {
                socket.emit('error', result.message)
            }
        })

        socket.on('disconnect', () => {
            console.log(`Usuario desconectado: ${socket.id}`)
        })

    })

}
