


const extractCookie = (cookieName) => {
    return document.cookie.split(';').find((item) => item = item.trim().startsWith(`${cookieName}`)).split('=')[1]
}

const productsInCart = JSON.parse(extractCookie('cartInfo')).products

const checkStock = () => {
    productsInCart.forEach((product) => {
        let productHTML = document.getElementById(`buttons-container-${product.product._id}`)
        let errorMessage = document.getElementById(`error-message-${product.product._id}`)
        let addButton = document.getElementById(`more-product-${product.product._id}`)
        let sustractButton = document.getElementById(`less-product-${product.product._id}`)
        if(product.product.stock < product.quantity) {
            productHTML.classList.add('border-danger')
            errorMessage.innerText = `The quantity exceeds the stock`
            errorMessage.classList.remove('d-none')
            return
        }
        if(product.product.stock === product.quantity) {
            addButton.disabled = true
            return
        }ç
    })
}
checkStock()

const addButton = document.getElementsByClassName('more-product')
const sustractButton = document.getElementsByClassName('less-product')
const quantityInput = document.getElementsByClassName('cart-item-quantity')

const addQuantity = async (e) => {
    e.preventDefault()
    const productId = e.target.id.split('-')[2]
    const quantityValue = e.target.value
    const productTotalId = document.getElementById(`cart-total-${productId}`)
    const priceUnitId = document.getElementById(`price-unit-${productId}`)
    const priceUnitValue = parseFloat(priceUnitId.innerHTML)

    if (quantityValue <= 0 || quantityValue === ' ' || quantityValue === null || quantityValue === NaN) return

    const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({quantity: parseFloat(quantityValue)}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    productTotalId.innerHTML = priceUnitValue * parseFloat(quantityValue)

    const data = await response.json()
    console.log(data)
}

// adds the quantity of the product by one to the cart
const addQuantityByOne = (e) => {
    e.preventDefault()
    const productId = e.target.id.split('-')[2]
    const addButton = document.getElementById(`more-product-${productId}`)
    const sustractButton = document.getElementById(`less-product-${productId}`)
    const productStock = parseInt(document.getElementById(`in-stock-${productId}`).innerHTML)
    let inputId = ''
    console.log(addButton, e.target.id)

    if(e.target.id === sustractButton.id){
        inputId = document.getElementById(e.target.nextElementSibling.id)
        inputId.value = parseFloat(inputId.value) - 1
        disabledButton(addButton, sustractButton, productStock, inputId, productId)
        inputId.dispatchEvent(new Event('input'))
        return
    }
    if(e.target.id === addButton.id){
        inputId = document.getElementById(e.target.previousElementSibling.id)
        inputId.value = parseFloat(inputId.value) + 1
        disabledButton(addButton, sustractButton, productStock, inputId, productId)
        inputId.dispatchEvent(new Event('input'))
        return
    }


    
}

// converts de quantityInput variable to and array and then adds it the event listener to perform the addition of the quantity
let inputsArray = Array.from(quantityInput)
inputsArray.forEach((input) => input.addEventListener('input', (e) => addQuantity(e)))

let moreProductArray = Array.from(addButton)
moreProductArray.forEach((button) => button.addEventListener('click', (e) => addQuantityByOne(e)))

console.log(moreProductArray)
let lessProductArray = Array.from(sustractButton)
lessProductArray.forEach((button) => button.addEventListener('click', (e) => addQuantityByOne(e)))

const disabledButton = (addButton, sustractButton, stock, inputId, productId) => {
    const errorMessage = document.getElementById(`error-message-${productId}`)

    if(inputId.value <= 1) {
        console.log("entro por inputId <= 1")
        sustractButton.disabled = true
        addButton.disabled = false
        inputId.value =  1
        errorMessage.classList.add('d-none')
        return
    }if (stock < inputId.value) {
        console.log("entro por stock < inputId.value")
        inputId.value = stock
        sustractButton.disabled = false
        addButton.disabled = true
        errorMessage.classList.add('d-none')
        return
    }
    if(stock >= inputId.value) {
        sustractButton.disabled = false
        addButton.disabled = false
        errorMessage.classList.add('d-none')
        return
    }
}


