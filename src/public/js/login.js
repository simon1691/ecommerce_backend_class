const form = document.getElementById('loginForm');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = new FormData(form)
    const loginData = {}

    data.forEach((value, key) => loginData[key] = value)
    
    console.log(loginData, JSON.stringify(loginData))

    fetch('/api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(loginData),
        headers: {
          'Content-Type': 'application/json'
        }
    }).then(response =>{
    console.log(response)
    if(response.status === 200){
        window.location.replace('/')
    }
})
})
