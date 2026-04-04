const socket      = io()
const createForm  = document.getElementById('productCreate')
const productsDiv = document.getElementById('products')
const prevBtn     = document.getElementById('prevBtn')
const nextBtn     = document.getElementById('nextBtn')
const pageInput   = document.getElementById('pageInput')
const pageTotalSpan = document.getElementById('pageTotalSpan')
const paginationInfo = document.getElementById('paginationInfo')
const pageJumpForm  = document.getElementById('pageJumpForm')
const limitSelect   = document.getElementById('limitSelect')

let currentPage  = 1
let currentLimit = 10

function requestProducts(page, limit) {
  socket.emit('getProducts', { page, limit })
}

socket.on('updateProducts', (result) => {
  const { docs, totalPages, page, totalDocs, limit } = result

  currentPage  = page
  currentLimit = limit

  paginationInfo.innerHTML =
    `Mostrando página <strong>${page}</strong> de <strong>${totalPages}</strong> (${totalDocs} productos en total)`

  pageInput.value = page
  pageInput.max = totalPages
  pageTotalSpan.textContent = `/ ${totalPages}`

  prevBtn.disabled = page <= 1
  nextBtn.disabled = page >= totalPages

  if (!docs || docs.length === 0) {
    productsDiv.innerHTML = `<p class='placeholder'>No hay productos en esta página.</p>`
    return
  }

  productsDiv.innerHTML = docs.map(p => `
    <div class='product-item'>
      <div>
        <strong>${p.title}</strong> — ${p.description}<br>
        Precio: $${p.price} &nbsp;|&nbsp; Stock: ${p.stock} &nbsp;|&nbsp; Categoría: ${p.category}
      </div>
      <button class='delete-btn' data-id='${p._id}'>Eliminar</button>
    </div>
  `).join('')

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      socket.emit('deleteProduct', btn.dataset.id)
    })
  })
})

socket.on('error', err => {
  console.error('Error desde servidor:', err)
  alert('Error: ' + (err.message || JSON.stringify(err)))
})

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) requestProducts(currentPage - 1, currentLimit)
})

nextBtn.addEventListener('click', () => {
  requestProducts(currentPage + 1, currentLimit)
})

pageJumpForm.addEventListener('submit', e => {
  e.preventDefault()
  const val     = parseInt(pageInput.value)
  const maxPage = parseInt(pageInput.max) || 1
  if (isNaN(val) || val < 1 || val > maxPage) {
    alert(`Número de página inválido. Ingresá un valor entre 1 y ${maxPage}.`)
    pageInput.value = currentPage
    return
  }
  requestProducts(val, currentLimit)
})

limitSelect.addEventListener('change', e => {
  currentLimit = parseInt(e.target.value)
  requestProducts(1, currentLimit)
})

createForm.addEventListener('submit', e => {
  e.preventDefault()
  const thumbnailsArray = document.getElementById('thumbnails').value
    .split('\n')
    .map(url => url.trim())
    .filter(url => url.length > 0)

  const product = {
    title:       document.getElementById('title').value,
    description: document.getElementById('description').value,
    price:       parseFloat(document.getElementById('price').value.replace(',', '.')),
    stock:       parseInt(document.getElementById('stock').value),
    category:    document.getElementById('category').value,
    thumbnails:  thumbnailsArray
  }
  socket.emit('addProduct', product)
  createForm.reset()
})