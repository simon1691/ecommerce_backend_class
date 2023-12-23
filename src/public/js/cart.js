const extractCookie = (cookieName) => {
    return document.cookie.split(';').find((item) => item = item.trim().startsWith(`${cookieName}`)).split('=')[1]
}

const addButton = document.getElementById('more-product')
const sustractButton = document.getElementById('less-product')
const quantityInput = document.getElementsByClassName('cart-item-quantity')
// const productsInCart = JSON.parse(extractCookie('productId')).products

const addQuantity = async (e) => {
    e.preventDefault()
    const productId = e.target.parentElement.parentElement.parentElement.parentElement.id.split('-')[1]
    const quantityValue = e.target.value
    
    if (quantityValue <= 0 || quantityValue === ' ' || quantityValue === null) return

    const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({quantity: quantityValue}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const data = await response.json()
    console.log(data)
}

Array.from(quantityInput).forEach((input) => input.addEventListener('input', (e) => addQuantity(e)))

// quantityInput.addEventListener('input', (e) => addQuantity(e))

