//Configuracion del socket de lado del cliente
const socket = io();
let content = document.getElementById('content')
// let title = document.getElementById('title')
// let description = document.getElementById('description')
// let price = document.getElementById('price')
// let thumbnail = document.getElementById('thumbnail')
// let code = document.getElementById('code')
// let stock = document.getElementById('stock')
// let id = document.getElementById('id')
let productos = ""

socket.on("products", data => {
    data.forEach(product => {
        productos += `<span>Title: </span><span>${product.title}</span><br>
        <span>description: </span><span>${product.description}</span><br>
        <span>price: </span><span>${product.price}</span><br>
        <span>thumbnail: </span><span>${product.thumbnail}</span><br>
        <span>code: </span><span>${product.code}</span><br>
        <span>stock: </span><span>${product.stock}</span><br>
        <span>id: </span><span>${product.id}</span><br><br>`
    })
    content.innerHTML = productos
})
