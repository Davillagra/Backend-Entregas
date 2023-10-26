const socket = io()
let chatbox = document.getElementById("chatbox")
let user,userName

const log = async () => {
  try {
    const response = await fetch("/api/sessions/current", {
      method: "GET",
    })
    if (response.ok) {
      const json = await response.json()
      user = json.session.email
      userName = json.session.first_name
      chatbox.addEventListener(`keyup`, (evt) => {
        if (evt.key === `Enter`) {
          if (chatbox.value.trim().length > 0) {
            socket.emit(`message`, { user, message: chatbox.value,userName })
            chatbox.value = ""
          }
        }
      })
    } else {
      window.location.href = "http://localhost:8080/login"
    }
  } catch (error) {
    console.error("Error al realizar la solicitud:", error)
  }
}
log()

socket.on(`messageLogs`, (data) => {
  let log = document.getElementById(`messageLogs`)
  let messages = ""
  data.forEach((e) => {
    messages = messages + `${e.userName} dice: ${e.message}</br>`
  })
  log.innerHTML = messages
})
