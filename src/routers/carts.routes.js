import {Router} from 'express'
// import cartsManager from '../services/CartsManagerFiles.js'
import CartManager from "../services/mongoDb/CartManager.js";

const cartManager = new CartManager()

const router = Router();

// GET Mostrar los carritos creados
router.get('/', async (req, res) => {
    try {
        let cartsList = await cartManager.getCarts()
        res.json(cartsList)
    } catch (error) {
        console.error(error)
    }
})
// POST Agregar un carrito
router.post('/', async(req, res) => {
   try {
    let newCart = req.body
    await cartManager.addCart(newCart)
    res.json(newCart)
   } catch (error) {
    console.error(error)
   }
})
// GET Carrito por ID
router.get('/:cid', async (req, res) => {
   try {
    let cartsList = await cartManager.getCartById(req.params.cid)
    res.json(cartsList)
   } catch (error) {
    console.error(error)
   }
})

// POST Agregar un producto por id a un carrito especificado
router.post('/:cid/product/:pid', async(req, res) => {
    try {
    let cartId = req.params.cid
    let productId = req.params.pid

    let cartWithProducts = await cartManager.addProductsInCart(cartId, productId)
    res.json(cartWithProducts)
    } catch (error) {
        console.error(error)
    }
})



export default router