const socket = io()

const addToCart = ()=>{
    const forms = document.querySelectorAll('#productos form')
    forms.forEach(form => {
        form.addEventListener('submit', async (event) =>{
            event.preventDefault()
            const formData = new FormData(form)
            const quantity = formData.get('quantity')
            const _id = formData.get('_id')
            socket.emit('addToCart', {_id,quantity})
            form.reset()
        })
    })      
}
addToCart()

socket.on("cartUpdated", async (data) => {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Carrito guardado`,
        showConfirmButton: true,
        toast: true,
        html: `<a href="/carts/${data._id}">Ir</a>`
      })
})