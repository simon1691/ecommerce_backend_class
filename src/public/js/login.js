const form = document.getElementById('loginForm');
const forgotPassword = document.getElementById('forgotPassword');
const passContainer = document.getElementById('pass-container');
const btnSubmit = document.getElementById('btn-submit');
const loginTitle = document.getElementById('login-title');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
let restorePasswordclicked = false

const setErrorMessage = (field, message = null) => {
    field.classList.remove('border-dark-subtle')
    field.classList.add('border-danger')
    field.nextElementSibling.classList.remove('d-none')
    if(message) {
        field.nextElementSibling.innerText = message
    }else{
        field.nextElementSibling.innerText = field.name === 'email' ? "Email is empty or invalid" : "Your password must contain at least one digit, one uppercase letter, and one lowercase letter, and be at least 8 characters long. Please try again."
    }
}


const clearErrorOnClick = (field) => {
    field.classList.remove('border-danger')
    field.classList.add('border-dark-subtle')
    field.nextElementSibling.classList.add('d-none')
}

//remove error message when input clicked
emailInput.addEventListener('click', () => { clearErrorOnClick(emailInput)})

passwordInput.addEventListener('click', () => { clearErrorOnClick(passwordInput)})

const isEmailValid = (email) => {
    const emailRgex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    !emailRgex.test(email.value) ? setErrorMessage(emailInput) : ""
    return  emailRgex.test(email.value)
}
 const isPasswordValid = (password) => {
    const passwordRgex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
    !passwordRgex.test(password.value) ? setErrorMessage(passwordInput) : ""
    return passwordRgex.test(password.value)
}

async function login (loginData){
    isEmailValid(emailInput)
    isPasswordValid(passwordInput)
   if (!isEmailValid(emailInput) || !isPasswordValid(passwordInput))  return

    const response = await fetch('/api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(loginData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const data = await response.json()
    if(response.status === 200){
        const cartIdCookie = data.user.carts[0]._id
        const userNameCookie = data.user.name
        document.cookie = `cartIdCookie=${cartIdCookie}`
        document.cookie = `userName=${userNameCookie}`
        window.location.replace('/')
    }
    if(response.status === 400){
        console.log(data.message)
        setErrorMessage(emailInput, data.message)
        setErrorMessage(passwordInput, data.message)
    }
}

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
