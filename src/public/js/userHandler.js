const form = document.getElementById("loginForm")
if(form){
    form.addEventListener('submit', async (event) =>{
    event.preventDefault()
    const formData = new FormData(form)
    const email = formData.get('email')
    const password = formData.get('password')
    const obj = {email,password}
    fetch('api/sessions/login',{
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type':'application/json'
        }
    }).then(result=> {
        if (result.status === 200) {
            return result.json()
        }
    }).then(json => {
        if(json.status === "error"){
            return alert("Datos incorrectos")
        } if(json.payload.role === "admin") {
            localStorage.setItem('token',json.token)
            window.location.replace('/products/admin')
        } else {
            localStorage.setItem('token', json.token)
            window.location.replace('/products')
        }
    })
    form.reset()
})
}


const signupform = document.getElementById("signupForm")
if(signupform){
    signupform.addEventListener('submit', async (event) =>{
    event.preventDefault()
    const formData = new FormData(signupform)
    const obj = {}
    formData.forEach((value, key) => obj[key] = value)
    fetch('api/sessions/signup', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => result.json()).then((json) => {
        if(!json.error){
            alert("Usuario creado")
            setTimeout(() => {
                window.location.replace('/login')
            }, 1000)
        } else {
            alert("Datos mal ingresados")
        }
    })
    signupform.reset()
})
}

const buy = document.getElementById("logout")
if(buy){
    buy.addEventListener("click", (event)=>{
    event.preventDefault()
    fetch('api/sessions/logout', {
        method: 'POST',
    }).then(response => {
        if (response.redirected) {
        window.location.href = response.url
        }
    })
    })
}

const recover = document.getElementById("recoverForm")
if(recover){
    if(recover){
        recover.addEventListener('submit', async (event) =>{
        event.preventDefault()
        const formData = new FormData(recover)
        const email = formData.get('email')
        fetch('api/sessions/recover', {
            method: 'POST',
            body: JSON.stringify({email}),
            headers: {
                'Content-Type':'application/json'
            }
        }).then(response => {
            window.location.href = "http://localhost:8080/login"
        })
        recover.reset()
    })
    }
}

const resetPassForm = document.getElementById("resetPassForm")
if(resetPassForm){
    if(resetPassForm){
        resetPassForm.addEventListener('submit', async (event) =>{
        event.preventDefault()
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')
        const email = urlParams.get('email')
        const formData = new FormData(resetPassForm)
        const pass = formData.get('pass')
        const passDup = formData.get('passDup')
        fetch('/api/sessions/restore', {
            method: 'POST',
            body: JSON.stringify({pass,passDup,email}),
            headers: {
                'Content-Type':'application/json'
            }
        }).then(result => result.json()).then(response => {
            console.log(response)
            if(response.status == "success"){
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: `Contraseña actualizada`,
                    showConfirmButton: true,
                    toast: true,
                    html: `<a href="/login">Iniciar sesion</a>`
                })
            }
            if(response.message == "Passwords don't match") {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: `Las contraseñas no coinciden`,
                    toast: true,
                })
            }
            if(response.message =="Password must be diferent from the previous one"){
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: `Debe ser una contraseña distinta a la anterior`,
                    toast: true,
                })
            }

        })
        resetPassForm.reset()
    })
    }
}
function toggleOptions() {
    var switchElement = document.getElementById('switch');
    var selectedOptionElement = document.getElementById('selectedOption');
    var selectedOptionInput = document.getElementById('selectedOptionInput');

    if (switchElement.checked) {
        selectedOptionElement.textContent = 'Premium';
        selectedOptionInput.value = 'premium';
    } else {
        selectedOptionElement.textContent = 'User';
        selectedOptionInput.value = 'user';
    }
}