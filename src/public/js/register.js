const form = document.getElementById('register')

form.addEventListener('submit', (e)=> {
    e.preventDefault();

    const data = new FormData(form)
    const fieldsData = {}

    data.forEach((value, key) => fieldsData[key] = value)

    fetch('/api/sessions/register', {
        method: 'POST',
        body: JSON.stringify(fieldsData),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response =>{
        if(response.status === 200){
            validateAllFields()
            // window.location.replace('/login')
        }
        validateAllFields()
    })
})


const isEmailValid = (email) => {
    const emailRgex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRgex.test(email)
}
 const isPasswordValid = (password) => {
    const passwordRgex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
    return passwordRgex.test(password)
}


const validateAllFields = () => {
    const inputFieldsArray = ['firstName', 'lastName', 'email', 'password',]
    inputFieldsArray.forEach(inputField => {
        let inputFieldElement = document.getElementById(inputField)
        if(inputFieldElement.id !== 'email' && inputFieldElement.id !== 'password'){
            if(inputFieldElement.value === ''){
                inputFieldElement.classList.remove('border-dark-subtle')
                inputFieldElement.classList.add('border-danger')
                inputFieldElement.nextElementSibling.classList.remove('d-none')
            }
            return
        }
       if(inputFieldElement.id === 'email'){
        if(!isEmailValid(inputFieldElement.value)){
            inputFieldElement.classList.remove('border-dark-subtle')
            inputFieldElement.classList.add('border-danger')
            inputFieldElement.nextElementSibling.classList.remove('d-none')
        }
       }
       if(inputFieldElement.id === 'password'){
        if(!isEmailValid(inputFieldElement.value)){
            inputFieldElement.classList.remove('border-dark-subtle')
            inputFieldElement.classList.add('border-danger')
            inputFieldElement.nextElementSibling.classList.remove('d-none')
        }
       }
    })
}