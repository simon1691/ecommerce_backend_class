const form = document.getElementById('restorePassForm');
const messageContainer = document.getElementById('messageContainer');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = new FormData(form)
    const restorePassData = {}

    data.forEach((value, key) => restorePassData[key] = value)

    fetch('/api/sessions/pass-recovery', {
        method: 'PUT',
        body: JSON.stringify(restorePassData),
        headers: {
          'Content-Type': 'application/json'
        }
    }).then(response =>{
        response.json()
        .then(data => {
        let payload = data
        console.log(payload.payload)

        if(payload.payload.success){
            messageContainer.classList.remove('error')
            messageContainer.classList.add("success");
            messageContainer.classList.remove('d-none')
            messageContainer.innerHTML = 
            `<span class="message">${payload.payload.message}</span>`

           setTimeout(() => {
            window.location.replace('/')
            messageContainer.classList.remove('success')
           }, 1000)
          
        }else{
            messageContainer.classList.remove('success')
            messageContainer.classList.add("error");
            messageContainer.classList.remove('d-none')
            messageContainer.innerHTML = `<span class="message">${payload.payload.message}</span>`
        }
        })
})
})

