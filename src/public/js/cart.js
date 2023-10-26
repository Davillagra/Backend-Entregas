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
        const res = await fetch(`/${cart._id}/purchase`, {
            method: "PUT",
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json'
            }
        })
      } else {
        console.log("error en la api")
      }
    } catch (error) { console.log("error en el fetch")}
  })
}
