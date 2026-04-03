import { CONSTANTS as CONST } from '../common/constants.js'

export const errorHandler = (err, req, res, next) => {
    console.error('[ERROR]', err)

    const status = err.statusCode || 500
    const message = err.message || CONST.SERVER_ERROR

    res.status(status).json({
        error: 'Si',
        message,
        details: err.details || null
    })
}