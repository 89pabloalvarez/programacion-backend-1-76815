const socket = io()
const createForm = document.getElementById('productCreate')
const title = document.getElementById('title')
const description = document.getElementById('description')
const price = document.getElementById('price')
const stock = document.getElementById('stock')
const category = document.getElementById('category')
const productsDiv = document.getElementById('products')

socket.on('updateProducts', (products) => {
  const { docs, totalPages, page } = products

  if (docs.length === 0) {
    productsDiv.innerHTML = `<p class='placeholder'>No hay productos cargados todavía...</p>`
    return
  }

  productsDiv.innerHTML = docs.map(p => `
    <div class='product-item'>
      <div>
        <strong>${p.title}</strong> - ${p.description} <br>
        Precio: $${p.price} <br>
        Stock: ${p.stock} <br>
        Categoría: ${p.category}
      </div>
      <button class='delete-btn' product-id='${p._id}'>Eliminar</button>
    </div>
  `).join('')

  const pageButtonsDiv = document.getElementById('page-buttons')
  pageButtonsDiv.innerHTML = ''

  // Botón "Anterior"
  if (page > 1) {
    const prevBtn = document.createElement('button')
    prevBtn.textContent = 'Anterior'
    prevBtn.addEventListener('click', () => {
      const limit = document.getElementById('limit').value
      socket.emit('getProducts', { page: page - 1, limit: parseInt(limit) })
    })
    pageButtonsDiv.appendChild(prevBtn)
  }

  // Botones numéricos
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button')
    btn.textContent = i
    if (i === page) btn.disabled = true
    btn.addEventListener('click', () => {
      const limit = document.getElementById('limit').value
      socket.emit('getProducts', { page: i, limit: parseInt(limit) })
    })
    pageButtonsDiv.appendChild(btn)
  }

  // Botón "Siguiente"
  if (page < totalPages) {
    const nextBtn = document.createElement('button')
    nextBtn.textContent = 'Siguiente'
    nextBtn.addEventListener('click', () => {
      const limit = document.getElementById('limit').value
      socket.emit('getProducts', { page: page + 1, limit: parseInt(limit) })
    })
    pageButtonsDiv.appendChild(nextBtn)
  }

  // Botones eliminar
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const productToDelete = btn.getAttribute('product-id')
      socket.emit('deleteProduct', productToDelete)
    })
  })

})

// Listener para cambio de límite
document.getElementById('limit').addEventListener('change', e => {
  socket.emit('getProducts', { page: 1, limit: parseInt(e.target.value) })
})

createForm.addEventListener('submit', e => {
  e.preventDefault()
  const priceValue = parseFloat(price.value.replace(',', '.'))
  const thumbnailsArray = thumbnails.value
    .split('\n')
    .map(url => url.trim())
    .filter(url => url.length > 0)
  const product = {
    title: title.value,
    description: description.value,
    price: priceValue,
    stock: parseInt(stock.value),
    category: category.value,
    thumbnails: thumbnailsArray
  }
  socket.emit('addProduct', product)
  createForm.reset()
})

socket.on('error', err => {
  console.error('Error desde servidor:', err)
})