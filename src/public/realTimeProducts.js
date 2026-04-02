const socket = io()
const createForm = document.getElementById('productCreate')
const title = document.getElementById('title')
const description = document.getElementById('description')
const price = document.getElementById('price')
const stock = document.getElementById('stock')
const category = document.getElementById('category')
const productsDiv = document.getElementById('products')

socket.on('updateProducts', (products) => {

  if (products.length === 0) {
    productsDiv.innerHTML = `<p class='placeholder'>No hay productos cargados todavía...</p>`
    return
  }

  productsDiv.innerHTML = products.map(p => `
    <div class='product-item'>
      <div>
        <strong>${p.title}</strong> - ${p.description} <br>
        Precio: $${p.price} <br>
        Stock: ${p.stock} <br>
        Categoría: ${p.category}
      </div>
      <button class='delete-btn' product-id='${p.id}'>Eliminar</button>
    </div>
  `).join('')

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const productToDelete = btn.getAttribute('product-id')
      socket.emit('deleteProduct', productToDelete)
    })
  })
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