import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

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

export function validateFields(objeto, allowedFields, schemaFields) {
    const result = {
        objectValid: true,
        fieldsMissing: [],
        fieldsInvalid: [],
        fieldsTypeError: []
    }
    for (const key in objeto) {
        if (!allowedFields.includes(key)) {
            result.fieldsInvalid.push(key)
        }
    }
    for (const field of allowedFields) {
        if (objeto.hasOwnProperty(field)) {
            const expectedType = schemaFields[field]
            const value = objeto[field]

            switch (expectedType) {
                case "string":
                    if (typeof value !== "string") {
                        result.fieldsTypeError.push(field)
                    }
                    break
                case "number":
                    if (typeof value !== "number") {
                        result.fieldsTypeError.push(field)
                    }
                    break
                case "integer":
                    if (typeof value !== "number" || !Number.isInteger(value)) {
                        result.fieldsTypeError.push(field)
                    }
                    break
                case "boolean":
                    if (typeof value !== "boolean") {
                        result.fieldsTypeError.push(field)
                    }
                    break
                case "array:string":
                    if (!Array.isArray(value) || !value.every(v => typeof v === "string")) { //Aca hay magia!! Recorro el array y encima dentro valido que sea un string cada
                        result.fieldsTypeError.push(field)
                    }
                    break
            }
        } else {
            result.fieldsMissing.push(field);
        }
    }
    if (result.fieldsMissing.length > 0 || result.fieldsTypeError.length > 0) {
        result.objectValid = false;
    }
    return result
}

export function generateId() {
    return uuidv4()
}

export function readJSON(path) {
    if (fs.existsSync(path)) {
        const fileData = fs.readFileSync(path, 'utf-8')
        return JSON.parse(fileData)
    }
    return []
}

export function writeJSON(path, data) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2))
}

export const unEscapedJson = (escapedJson) => {
  try {
    if (typeof escapedJson !== 'string') {
      throw new Error('El parámetro debe ser un String')
    }
    const parsed = JSON.parse(escapedJson)
    return parsed
  } catch (error) {
    console.error('Error al des-escapar JSON:', error.message)
    return null
  }
}