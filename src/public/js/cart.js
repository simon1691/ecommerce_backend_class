const extractCookie = (cookieName) => {
    return document.cookie.split(';').find((item) => item = item.trim().startsWith(`${cookieName}`)).split('=')[1]
}

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
    const inputId = document.getElementById(e.target.previousElementSibling.id)
    inputId.value = parseFloat(inputId.value) + 1
    inputId.dispatchEvent(new Event('input'))
}

const removeQuantityByOne = (e) => {
    e.preventDefault()
    const inputId = document.getElementById(e.target.nextElementSibling.id)
    if(inputId.value <= 1) return
    inputId.value = parseFloat(inputId.value) - 1
    inputId.dispatchEvent(new Event('input'))

}
// converts de quantityInput variable to and array and then adds it the event listener to perform the addition of the quantity
let inputsArray = Array.from(quantityInput)
inputsArray.forEach((input) => input.addEventListener('input', (e) => addQuantity(e)))

let moreProductArray = Array.from(addButton)
moreProductArray.forEach((button) => button.addEventListener('click', (e) => addQuantityByOne(e)))

console.log(moreProductArray)
let lessProductArray = Array.from(sustractButton)
lessProductArray.forEach((button) => button.addEventListener('click', (e) => removeQuantityByOne(e)))




