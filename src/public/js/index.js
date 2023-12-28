const logout = document.getElementById('logout')
const cart = document.getElementById('cart')






logout.addEventListener('click', () => {
    fetch('/api/sessions/logout')
    .then((response) => {
        if(response.status === 200) {
            window.location.replace('/login')
        }
    })
})

cart.addEventListener('click', async () => {
    try {
        let idCart = cartIdFromCookie()
        const response = await fetch(`/api/carts/${cartId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        if (data.payload.success === true) {
            document.cookie = `cartInfo=${JSON.stringify(data.payload.cart)}`
            window.location.href = `/cart/${idCart}`
        }else {
            window.location.href = '/404'
        }
    } catch (error) {
        console.error(error)
        window.location.href = '/error'
    }
})

// get id by product and add it to cart
const getId = (e) => {
    let idProduct = e.target.id
    let cartId = cartIdFromCookie()
    addProductToCart(cartId, idProduct)
    showProductAddedAlert(e)

}

const showProductAddedAlert = (e) => {
    const productId = e.target.id
    const productName = document.getElementById(`product-name-${productId}`).innerText
    const productAddedHTML = document.getElementById('product-added-alert')
    const productAddedNameHTML = document.getElementById('product-added-name')
    const productAddedAlert = document.createElement('div')
    productAddedAlert.setAttribute('id', 'product-added-alert')
    productAddedAlert.setAttribute('class', 'position-absolute mx-3')
    productAddedAlert.innerHTML = `
        <div class="border border-success rounded p-3 position-relative bg-white">
            <div class="text-container ps-2">
                <p id="product-added-name" class="my-0"></p>
                <p class="mt-1 mb-0">was added successfuly to the cart!</p>
            </div>
        </div>`


    productAddedHTML.classList.add('product-added-alert-animation-in')
    
    hidesAlertTimeOut = setTimeout(() => {
        console.log('test')
        productAddedHTML.classList.remove('product-added-alert-animation-in')
        productAddedHTML.classList.add('product-added-alert-animation-out')
    }, 2000)
    productAddedNameHTML.innerText = productName
}

const addProductToCart = async (cartId, idProduct) => {
    try {

        const response = await fetch(`/api/carts/${cartId}/product/${idProduct}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        console.log(data)
        if(response.status === 200){
            thereIsProductInCart(cartId)
        }
    }catch(error){
        console.error(error)
    }
}

const thereIsProductInCart = async (cartId) => {
    try {
        const response = await fetch(`/api/carts/${cartId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        productsInCart = data.payload.cart.products.length > 0 ? true : false
        productsInCart ? cart.classList.remove('d-none') : cart.classList.add('d-none')

    } catch (error) {
        console.error(error)
    }

}

const cartIdFromCookie = () => {
    return document.cookie.split(';').find((item) => item = item.trim().startsWith('cartIdCookie')).split('=')[1]
}


// hide cart button if you are in cart url
const url = window.location.pathname
const cartId = cartIdFromCookie()
if (url === `/cart/${cartId}`) cart.classList.add('d-none')
