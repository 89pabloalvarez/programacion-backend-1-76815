import app from './config/app.js'
import { CONSTANTS as CONST } from './utils/constants/constants.js'
import { startupServer } from './utils/functions/functions.js'
import apiRouter from './services/index.js'

app.use(CONST.DIR_URL_ROOT, apiRouter)

app.listen(CONST.PORT, () => {
    startupServer(CONST.BASEURL)
})