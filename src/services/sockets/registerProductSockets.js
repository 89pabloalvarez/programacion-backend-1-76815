import { productManager } from '../products/productsServices.js'

export default function registerProductSockets(io) {

    io.on('connection', (socket) => {
        console.log(`Usuario conectado: ${socket.id}`)

        socket.emit('updateProducts', productManager.getAll())

        socket.on('addProduct', (body) => {
            const result = productManager.create(body)
            if (result.success) {
                io.emit('updateProducts', productManager.getAll())
            } else {
                socket.emit('error', result.message)
            }
        })

        socket.on('deleteProduct', (productToDelete) => {
            const result = productManager.delete(productToDelete)
            if (result.success) {
                io.emit('updateProducts', productManager.getAll())
            } else {
                socket.emit('error', result.message)
            }
        })

        socket.on('disconnect', () => {
            console.log(`Usuario desconectado: ${socket.id}`)
        })

    })

}
