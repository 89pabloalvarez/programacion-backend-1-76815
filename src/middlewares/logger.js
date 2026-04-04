import { unEscapedJson } from '../common/functions.js'

const ahora = () => {
  const fecha = new Date();
  const fechaCompleta = fecha.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
  const horaCompleta = fecha.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
  return `${fechaCompleta} - ${horaCompleta}`
}

export const loggerRequest = (req, res, next) => {
    console.log(`
        [REQUEST] -
        Método: ${req.method} -
        Path: '${req.url}' -
        Headers: ${JSON.stringify(req.headers)} -
        Body: ${JSON.stringify(req.body)} -
        Fecha: '${ahora()}'
    `)
    next()
}

export const loggerResponse = (req, res, next) => {
    const originalSend = res.send
    res.send = function (body) {
    console.log(`
        [RESPONSE] -
        Método: ${req.method} -
        Path: '${req.url}' -
        Status: ${res.statusCode} -
        Body: ${unEscapedJson(JSON.stringify(body))} -
        Fecha: '${ahora()}'
    `)
    return originalSend.call(this, body)
  }
  next()
}