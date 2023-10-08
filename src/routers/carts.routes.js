import { Router } from "express";
import {getAllCarts, addCart, getCartById, addProductsInCart, deleteProductsInCart, deleteCart, updateGetCartById, updateProductsInCart} from "../controllers/carts.controller.js";

const router = Router();

// GET Mostrar los carritos creados
router.get("/", getAllCarts);

// POST Agregar un carrito
router.post("/", addCart);

// GET Carrito por ID
router.get("/:cid", getCartById)

// POST Agregar un producto por id a un carrito especificado
router.post("/:cid/product/:pid/", addProductsInCart);

//DELETE Product from cart
router.delete("/:cid/product/:pid/", deleteProductsInCart);

//DELETE cart
router.delete("/:cid", deleteCart);

// Put Mostar Carrito por ID y todos sus productos
router.put("/:cid", updateGetCartById);

// PUT Actualizar quantity en un producto por id a un carrito especificado
router.put("/:cid/product/:pid/", updateProductsInCart);

export default router;
