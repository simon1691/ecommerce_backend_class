import {Router} from 'express'
import cartsManager from '../CartsManagerFiles.js'

const router = Router();

// GET Mostrar los carritos creados
router.get('/', async (req, res) => {
    try {
        let cartsList = await cartsManager.getCarts()

        res.json(cartsList)
    } catch (error) {
        console.error(error)
    }
})

router.get('/:cid', async (req, res) => {
   try {
    let cartsList = await cartsManager.getProductsInCart(req.params.cid)
    res.json(cartsList)
   } catch (error) {
    console.error(error)
   }
})

// POST Agregar un carrito
router.post('/', async(req, res) => {
   try {
    await cartsManager.addCart()
    res.json(' ')
   } catch (error) {
    console.error(error)
   }
})

// POST Agregar un producto por id a un carrito especificado
router.post('/:cid/product/:pid', async(req, res) => {
    try {
        let cartId = req.params.cid
    let productId = req.params.pid
    let newProduct = req.body
    await cartsManager.addProductsInCart(newProduct, cartId, productId)
    res.json(newProduct)
    } catch (error) {
        console.error(error)
    }
})



export default router