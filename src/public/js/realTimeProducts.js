const socket = io()

socket.on("change", async (data) => {
    await updateProducts(data.data)
})

const updateForm = ()=>{
  const forms = document.querySelectorAll('#productos form')
  forms.forEach(form => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const formData = new FormData(form)
    const _id = form.id
    const title = formData.get('tittle')
    const description = formData.get('description')
    const price = formData.get('price')
    const stock = formData.get('stock')
    const code = formData.get('code')
    const productData = {_id}
    if(title !== ""){
      productData.title = title
    }
    if(description !== ""){
      productData.description = description
    }
    if(price){
      productData.price = price
    }
    if(stock){
      productData.stock = stock
    }
    if(code !== ""){
      productData.code = code
    }
    socket.emit('form', productData)
    form.reset()
  })
})
}
updateForm()

const updateProducts = async (data) => {
    try {
        const productosDiv = document.getElementById("productos")
        productosDiv.innerHTML = ""
        data.forEach(producto => {
            const productDiv = document.createElement("div")
            productDiv.innerHTML = `
            <form id="${producto._id}">
                <input type="text" name="tittle">Producto: ${producto.title}</input>
                <br>
                <input type="text" name="description">Descripccion: ${producto.description}</input>
                <br>
                <input type="number" name="price" min="0">Precio: $${producto.price}</input>
                <br>
                <input type="text" name="code" >Codigo: ${producto.code}</input>
                <br>
                <input type="number" name="stock" min="0">Stock: ${producto.stock}</input>
                <br>
                <button type="submit">Enviar</button>
            </form>
            `
            productosDiv.appendChild(productDiv)
        })
        updateForm()
    } catch (error) {
        console.log("Error al actualizar productos:", error)
    }
}