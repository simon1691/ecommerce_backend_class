 const getId = (e) => {
    let idProduct = e.target.id
    console.log(idProduct)
}

const logout = document.getElementById('logout')

logout.addEventListener('click', () => {
    fetch('/api/sessions/logout')
    .then((response) => {
        if(response.status === 200) {
            window.location.replace('/login')
        }
    })
})

