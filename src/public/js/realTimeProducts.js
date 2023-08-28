const socket = io()

socket.on("change", async (data) => {
    await updateProducts(data.data)
})

const forms = document.querySelectorAll('#productos form');
forms.forEach(form => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const formData = new FormData(form)
    const id = +form.id;
    const title = formData.get('tittle')
    const description = formData.get('description')
    const price = formData.get('price')
    const stock = formData.get('stock')
    const codeElement = form.querySelector('.code')
    const code = codeElement.textContent.trim()
    console.log(code)
    const productData = {
      id,
      title,
      description,
      code,
      price,
      stock
    }
    socket.emit('form', productData)
    form.reset()
  })
})

const updateProducts = async (data) => {
    try {
        const productosDiv = document.getElementById("productos")
        productosDiv.innerHTML = ""
        console.log(data)
        data.forEach(producto => {
            const productDiv = document.createElement("div")
            productDiv.innerHTML = `
            <form id="{{this.id}}">
                <input required type="text" name="tittle">Producto: ${producto.title}</input>
                <br>
                <input required type="text" name="description">Descripccion: ${producto.description}</input>
                <br>
                <input required type="number" name="price">Precio: ${producto.price}</input>
                <br>
                <span>Codigo: </span><span class="code" name="code">${producto.code}</span>
                <br>
                <input required type="number" name="stock">Stock: ${producto.stock}</input>
                <br>
                <button type="submit">Enviar</button>
            </form>
            `
            productosDiv.appendChild(productDiv)
        })
    } catch (error) {
        console.log("Error al actualizar productos:", error)
    }
}