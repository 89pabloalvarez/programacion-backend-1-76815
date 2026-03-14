import app from './config/app.js'
import { Server } from 'socket.io'
import { CONSTANTS as CONST } from './utils/constants/constants.js'
import { startupServer } from './utils/functions/functions.js'
import apiRouter from './services/index.js'
import viewsRouter from './views/views-router.js'
import registerProductSockets from './services/sockets/registerProductSockets.js'

app.use(CONST.DIR_URL_ROOT, apiRouter)
app.use('/', viewsRouter)

const serverHttp = app.listen(CONST.PORT, () => {
  startupServer(CONST.BASEURL)
})

const io = new Server(serverHttp)

registerProductSockets(io)