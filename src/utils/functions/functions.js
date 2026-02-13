export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export async function startupServer(BASEURL) {
    await sleep(100)
    console.log(`Iniciando en 3..`)
    await sleep(500)
    console.log(`Iniciando en 2..`)
    await sleep(500)
    console.log(`Iniciando en 1..`)
    await sleep(500)
    console.log(`Servidor iniciado en: ${BASEURL}`)
}

export function validateFields(objeto, allowedFields) {
    const result = {
        objectValid: true,
        fieldsEmpty: [],
        fieldsInvalid: []
    }
    for (const key in objeto) {
        if (!allowedFields.includes(key)) {
            result.fieldsInvalid.push(key)
        }
    }
    for (const field of allowedFields) {
        if (!objeto.hasOwnProperty(field)) {
            result.fieldsEmpty.push(field)
        }
    }
    if (result.fieldsEmpty.length > 0) {
        result.objectValid = false
    }
    return result
}