import app from './config/app.js'
import { CONSTANTS as CONST } from './utils/constants/constants.js'
import { startupServer } from './utils/functions/functions.js'
import { cartsManager } from './services/carts/cartsServices.js'
import { productManager } from './services/products/productsServices.js'

//////////////////////////////////////////////////////////////
///////////////////////////PRODUCTS///////////////////////////
//////////////////////////////////////////////////////////////

//Obtener todos los productos.
app.get(CONST.DIR_URL_PRODUCTS, (req, res) => res.json(productManager.getAll()))

//Obtener un producto filtrando por su id.
app.get(`${CONST.DIR_URL_PRODUCTS}/:id`, (req, res) => {
    try {
        res.json(productManager.getById(req.params.id))
    } catch (err) {
        if (err.details) {
            res.status(404).json(err.details)
        } else {
            res.status(404).json({ error: err.message })
        }
    }
})

//Crear un nuevo producto.
app.post(CONST.DIR_URL_PRODUCTS, (req, res) => {
  const result = productManager.create(req.body)
  if (result.success) {
    res.status(200).json(result)
  } else {
    res.status(400).json(result)
  }
})

//Actualizar un producto obtenido por su ID.
app.put(`${CONST.DIR_URL_PRODUCTS}/:id`, (req, res) => {
    const result = productManager.update(req.params.id, req.body)
    if (result.success) {
        res.status(201).json(result)
    } else {
        res.status(400).json(result)
    }
})

//Eliminar un producto por su ID.
app.delete(`${CONST.DIR_URL_PRODUCTS}/:id`, (req, res) => {
    try {
        res.json(productManager.delete(req.params.id))
    } catch (err) {
        if (err.details) {
            res.status(404).json(err.details)
        } else {
            res.status(404).json({ error: err.message })
        }
    }
})

//////////////////////////////////////////////////////////////
/////////////////////////CARTS////////////////////////////////
//////////////////////////////////////////////////////////////

// Crear un nuevo carrito
app.post(CONST.DIR_URL_CARTS, (req, res) => {
    res.status(201).json({ message: "Carrito creado (estructura)" })
})

// Listar los productos de un carrito por su cid
app.get(`${CONST.DIR_URL_CARTS}/:id`, (req, res) => {
    res.json({ message: `Productos del carrito ${req.params.id} (estructura)` })
})

// Agregar un producto al carrito seleccionado.
app.post(`${CONST.DIR_URL_CARTS}/:cid/product/:pid`, (req, res) => {
    res.status(201).json({ message: `Producto ${req.params.pid} agregado al carrito ${req.params.cid} (estructura)` })
})

app.listen(CONST.PORT, () => {
    startupServer(CONST.BASEURL)
})