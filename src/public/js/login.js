const form = document.getElementById('loginForm');
const forgotPassword = document.getElementById('forgotPassword');
const passContainer = document.getElementById('pass-container');
const btnSubmit = document.getElementById('btn-submit');
const loginTitle = document.getElementById('login-title');
let restorePasswordclicked = false

forgotPassword.addEventListener('click', (e) => {   
    e.preventDefault();
    btnSubmit.value = "Send email"
    passContainer.classList.add('d-none')
    loginTitle.innerText = "Restaura tu contrasena"
    restorePasswordclicked = true
    forgotPassword.parentElement.classList.add('d-none')
})

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = new FormData(form)
    const loginData = {}

    data.forEach((value, key) => loginData[key] = value)

    if (restorePasswordclicked) {
        fetch('/api/sessions/forgot-password', {
            method: 'POST',
            body: JSON.stringify(loginData),
            headers: {
              'Content-Type': 'application/json'
            }
        }).then(response =>{
        if(response.status === 200){
            alert('Revisa tu correo. Te hemos enviado un email para restaurar tu contraseña')
            window.location.replace('/')
        }
        })
    }else{
        fetch('/api/sessions/login', {
            method: 'POST',
            body: JSON.stringify(loginData),
            headers: {
              'Content-Type': 'application/json'
            }
        }).then(response =>{
        if(response.status === 200){
            window.location.replace('/')
        }
    })
    }
})
