const form = document.getElementById('register')

form.addEventListener('submit', (e)=> {
    e.preventDefault();

    const data = new FormData(form)
    const fieldsData = {}

    data.forEach((value, key) => fieldsData[key] = value)
    console.log(fieldsData,  JSON.stringify(fieldsData))

    fetch('/api/sessions/register', {
        method: 'POST',
        body: JSON.stringify(fieldsData),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response =>{
        console.log(response)
        if(response.status === 200){
            window.location.replace('/login')
        }
    })
})