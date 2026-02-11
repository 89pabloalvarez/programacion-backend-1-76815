import app from './config/app.js'
import { CONSTANTS as CONST } from './utils/constants/constants.js'
import { startupServer } from './utils/functions/functions.js'
import ProductsServices from './services/products/productsServices.js'
import CartsServices from './services/carts/cartsServices.js'

const productsServices = new ProductsServices()
const cartsServices = new CartsServices()

app.listen(CONST.PORT, () => {
    startupServer(CONST.BASEURL)
})