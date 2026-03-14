export default function registerProductSockets(io) {
    let products = []

    io.on("connection", (socket) => {
        console.log(`Usuario conectado: ${socket.id}`)

        socket.emit("updateProducts", products)

        socket.on("addProduct", (newProduct) => {
            products.push(newProduct)
            io.emit("updateProducts", products)
        })

        socket.on("deleteProduct", (codeToDelete) => {
            products = products.filter(p => p.code !== codeToDelete)
            io.emit("updateProducts", products)
        })

        socket.on("disconnect", () => {
            console.log(`Usuario desconectado: ${socket.id}`)
        })

    })

}
