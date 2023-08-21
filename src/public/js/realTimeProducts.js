const socket = io();

socket.on("change", async (data) => {
    await updateProducts(data.data)
})

const updateProducts = async (data) => {
    try {
        const productosDiv = document.getElementById("productos")
        productosDiv.innerHTML = ""
        console.log(data)
        data.forEach(producto => {
            const productDiv = document.createElement("div")
            productDiv.innerHTML = `
                <h2>Producto: ${producto.title}</h2>
                <p>Descripción: ${producto.description}</p>
                <p>Precio: $${producto.price}</p>
                <p>Código: ${producto.code}</p>
                <p>Stock: ${producto.stock}</p>
            `
            productosDiv.appendChild(productDiv)
        })
    } catch (error) {
        console.log("Error al actualizar productos:", error)
    }
}