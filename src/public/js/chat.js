const socket = io()
let chatbox = document.getElementById("chatbox")
let user

Swal.fire({
    title: "Ingrese su Email",
    input: "text",
    icon: "warning",
    inputValidator: (value) => {
        if (!value) {
            return "Escriba una dirección de correo válida";
        }
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
        if (!emailRegex.test(value)) {
            return "Escriba una dirección de correo electrónico válida"
        }
        return undefined
    },
    allowOutsideClick: false,
}).then((res) => {
    if (res.value) {
        user = res.value;
    }
});

chatbox.addEventListener(`keyup`,(evt)=>{
    if (evt.key===`Enter`){
        if(chatbox.value.trim().length > 0){
            console.log({user:user,message:chatbox.value})
            socket.emit(`message`,{user:user,message:chatbox.value})
            chatbox.value=""
        }
    }
})

socket.on(`messageLogs`, data =>{
    let log = document.getElementById(`messageLogs`)
    let messages = ""
    data.forEach(e => {
        messages = messages + `${e.user} dice: ${e.message}</br>`
    })
    log.innerHTML = messages
})