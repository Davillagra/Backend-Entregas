const socket = io()

const addToCart = ()=>{
    const forms = document.querySelectorAll('#productos form')
    forms.forEach(form => {
        form.addEventListener('submit', async (event) =>{
            event.preventDefault()
            const formData = new FormData(form)
            const quantity = +formData.get('quantity') || 0
            const _id = formData.get('_id')
            const obj = {_id,quantity}
            if(!quantity==0){ 
                fetch('api/cart/', {
                method: 'POST',
                body: JSON.stringify(obj),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(result => result.json()).then((json) => {
                if(json.status ==="success") {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: `Carrito guardado`,
                        showConfirmButton: true,
                        toast: true,
                        html: `<a href="/carts/${json.id}">Ir</a>`
                      })  
                } else {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: `No se pudo añadir`,
                        showConfirmButton: true,
                        toast: true,
                      })
                }
            })
            } else {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: `No se pudo añadir`,
                    showConfirmButton: true,
                    toast: true,
                  })
            }

            form.reset()
        })
    })      
}
addToCart()