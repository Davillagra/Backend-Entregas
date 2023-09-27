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
        if(!json.error){
            if (json.payload.role === "admin") {
            window.location.replace('/api/products/realTimeProducts')
        } else {
            window.location.replace('/products')
        }
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
    }).then(result => result.json()).then(json => console.log(json))
    signupform.reset()
})
}

const logout = document.getElementById("logout")
if(logout){
    logout.addEventListener("click", (event)=>{
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
