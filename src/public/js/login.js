const form = document.getElementById('loginForm');
const forgotPassword = document.getElementById('forgotPassword');
const passContainer = document.getElementById('pass-container');
const btnSubmit = document.getElementById('btn-submit');
const loginTitle = document.getElementById('login-title');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
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
        restorePassword(loginData)
    }else{
        login(loginData)
    }
})


async function restorePassword(loginData) {
    const response = await fetch('/api/sessions/forgot-password', {
        method: 'POST',
        body: JSON.stringify(loginData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if(response.status === 200){
        alert('Revisa tu correo. Te hemos enviado un email para restaurar tu contraseña')
        window.location.replace('/')
    }
}

async function login (loginData){
   passAndEmailValidation(isEmailValid(loginData.email), isPasswordValid(loginData.password))

    const response = await fetch('/api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(loginData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const data = await response.json()
    const cartIdCookie = data.user.carts[0]._id
    const userNameCookie = data.user.name
    document.cookie = `cartIdCookie=${cartIdCookie}`
    document.cookie = `userName=${userNameCookie}`
    if(response.status === 200){
        window.location.replace('/')
    }
}

const isEmailValid = (email) => {
    const emailRgex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRgex.test(email)
}
 const isPasswordValid = (password) => {
    const passwordRgex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
    return passwordRgex.test(password)
}

const passAndEmailValidation = (isEmailValid, isPasswordValid) => {
    if(!isEmailValid || !isPasswordValid){
        if(!isEmailValid){
            emailInput.classList.remove('border-dark-subtle')
            emailInput.classList.add('border-danger')
            emailInput.nextElementSibling.classList.remove('d-none')
        }
        if(!isPasswordValid){
            passwordInput.classList.remove('border-dark-subtle')
            passwordInput.classList.add('border-danger')
            passwordInput.nextElementSibling.classList.remove('d-none')
        }
        return false
    }
    return true
}

//remove error message when input clicked
emailInput.addEventListener('click', () => {
    emailInput.classList.add('border-dark-subtle')
    emailInput.classList.remove('border-danger')
    emailInput.nextElementSibling.classList.add('d-none')
})

passwordInput.addEventListener('click', () => {
    passwordInput.classList.add('border-dark-subtle')
    passwordInput.classList.remove('border-danger')
    passwordInput.nextElementSibling.classList.add('d-none')
})