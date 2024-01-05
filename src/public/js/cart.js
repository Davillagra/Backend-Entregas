const socket = io()

const confirmBuy = document.getElementById("buy")
if (confirmBuy) {
  confirmBuy.addEventListener("click", async (event) => {
    event.preventDefault()
    try {
      const response = await fetch("/api/sessions/current", {
        method: "GET",
      })
      if (response.ok) {
        const json = await response.json()
        let cart = json.session.cart
        let email = json.session.email
        let obj = {email}
        const res = await fetch(`/api/cart/${cart._id}/purchase`, {
            method: "PUT",
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(res.ok){
          const data = await res.json()
          Swal.fire({
            icon: 'success',
            title: 'Compra existosa',
            text: `Codigo de la compra: ${data.ticket.code}`,
          }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/products'
            }
        })
        } else {
          const data = await res.json()
          const showProds = await data.data.map((p) => p.title).join(', ')
          Swal.fire({
            icon: 'error',
            title: `Algunos productos superan el Stock`,
            text: `${showProds}`,
            showConfirmButton: true,
            toast: true,
          })
        }
      } else {
        console.log("error en la api")
      }
    } catch (error) { console.log(error)}
  })
}

const removeFromCart = ()=>{
  const forms = document.querySelectorAll('#productos')
  forms.forEach(form => {
      form.addEventListener('submit', async (event) =>{
          event.preventDefault()
          const formData = new FormData(form)
          const quantity = +formData.get('quantity') || 1
          const _id = formData.get('_id')
          const cid = formData.get('cid')
          const oldQuantity = formData.get('oldQuantity')
          const newQuantity = oldQuantity-quantity
          const obj = {quantity:newQuantity}
          console.log(newQuantity)
          if(newQuantity!=0){
            try {
              const response = await fetch(`/api/cart/${cid}/product/${_id}`,{
              method: "PUT",
              body: JSON.stringify(obj),
              headers: {
                  'Content-Type': 'application/json'
              }
            }) 
            if(response.ok){
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: `Cantidad actualizada`,
                showConfirmButton: true,
                toast: true,
              })
              window.location.reload()
            }
            } catch (error) {
              console.log(error)
            }
            
          } else {
            try {
            const response = await fetch(`/api/cart/${cid}/products`,{
              method: "DELETE",
            })
            if(response.ok) {
              const data = await response.json()
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: `Cantidad actualizada`,
                showConfirmButton: true,
                toast: true,
              })
              window.location.reload()
            }
          } catch (error) {
            console.log(error)
          }}
          form.reset()
      })
  })      
}
removeFromCart()
