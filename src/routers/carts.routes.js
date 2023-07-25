import {Router} from 'express'
import cartsManager from '../CartsManagerFiles.js'

const router = Router();

// GET Mostrar los carritos creados
router.get('/', async (req, res) => {
    let cartsList = await cartsManager.getCarts()

    res.send(cartsList)
})

router.get('/:cid', async (req, res) => {
    let cartsList = await cartsManager.getProductsInCart(req.params.cid)
    res.send(cartsList)
})

// POST Agregar un carrito
router.post('/', async(req, res) => {
    await cartsManager.addCart()
    res.send(' ')
})

// POST Agregar un producto por id a un carrito especificado
router.post('/:cid/product/:pid', async(req, res) => {
    let cartId = req.params.cid
    let productId = req.params.pid
    let newProduct = req.body
    await cartsManager.addProductsInCart(newProduct, cartId, productId)
    res.send(newProduct)
})



export default router