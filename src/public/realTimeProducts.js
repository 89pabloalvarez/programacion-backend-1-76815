const socket = io()
const createForm = document.getElementById("productCreate")
const title = document.getElementById("title")
const description = document.getElementById("description")
const code = document.getElementById("code")
const price = document.getElementById("price")
const stock = document.getElementById("stock")
const category = document.getElementById("category")
const productsDiv = document.getElementById("products")

socket.on("updateProducts", (products) => {

  if (products.length === 0) {
    productsDiv.innerHTML = `<p class="placeholder">No hay productos cargados todavía...</p>`
    return
  }

  productsDiv.innerHTML = products.map(p => `
    <div class="product-item">
      <div>
        <strong>${p.title}</strong> - ${p.description} <br>
        Código: ${p.code} | Precio: $${p.price} <br>
        Stock: ${p.stock} | Disponible: ${p.status ? "Sí" : "No"} <br>
        Categoría: ${p.category}
      </div>
      <button class="delete-btn" data-code="${p.code}">Eliminar</button>
    </div>
  `).join("")

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const productToDelete = btn.getAttribute("data-code")
      socket.emit("deleteProduct", productToDelete)
    })
  })
})

createForm.addEventListener("submit", e => {
  e.preventDefault()
  const priceValue = parseFloat(price.value.replace(',', '.'))
  const product = {
    title: title.value,
    description: description.value,
    code: code.value,
    price: priceValue,
    status: true,
    stock: parseInt(stock.value),
    category: category.value
  }
  socket.emit("addProduct", product)
  createForm.reset()
})

socket.on("error", err => {
  console.error("Error desde servidor:", err)
})