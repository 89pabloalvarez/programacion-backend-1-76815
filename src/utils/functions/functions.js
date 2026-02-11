export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export async function startupServer(BASEURL) {
    await sleep(100)
    console.log(`Iniciando en 3..`)
    await sleep(500)
    console.log(`Iniciando en 2..`)
    await sleep(500)
    console.log(`Iniciando en 1..`)
    await sleep(500)
    console.log(`Servidor arriba en: ${BASEURL}`)
}