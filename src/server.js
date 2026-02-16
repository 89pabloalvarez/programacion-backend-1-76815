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
        res.status(200).json(result)
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
    const result = cartsManager.create(req.body)
    if (result.success) {
        res.status(201).json(result)
    } else {
        res.status(400).json(result)
    }
})

// Listar los productos de un carrito por su id
app.get(`${CONST.DIR_URL_CARTS}/:id`, (req, res) => {
    try {
        const result = cartsManager.getProductsByCartId(req.params.id)
        res.status(200).json(result)
    } catch (err) {
        if (err.details) {
            res.status(404).json(err.details)
        } else {
            res.status(404).json({ error: err.message })
        }
    }
})

// Agregar un producto al carrito seleccionado.
app.post(`${CONST.DIR_URL_CARTS}/:cid/product/:pid`, (req, res) => {
    try {
        const result = cartsManager.addProductToCart(req.params.cid, req.params.pid, req.body)
        if (result.success) {
            res.status(200).json(result)
        } else {
            res.status(400).json(result)
        }
    } catch (err) {
        if (err.details) {
            res.status(404).json(err.details)
        } else {
            res.status(404).json({ error: err.message })
        }
    }
})

app.listen(CONST.PORT, () => {
    startupServer(CONST.BASEURL)
})