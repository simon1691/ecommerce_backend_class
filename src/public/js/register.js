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
            window.location.replace('/login')
        }
    })
})