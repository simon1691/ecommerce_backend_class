import { Router } from "express";
// import cartsManager from '../services/CartsManagerFiles.js'
import CartManager from "../services/mongoDb/CartManager.js";

const cartManager = new CartManager();

const router = Router();

// GET Mostrar los carritos creados
router.get("/", async (req, res) => {
  try {
    let cartsList = await cartManager.getCarts();
    res.json(cartsList);
  } catch (error) {
    console.error(error);
  }
});
// POST Agregar un carrito
router.post("/", async (req, res) => {
  try {
    let newCart = req.body;
    let newCartDB = await cartManager.addCart(newCart);
    res.json(newCartDB);
  } catch (error) {
    console.error(error);
  }
});
// GET Carrito por ID
router.get("/:cid", async (req, res) => {
  try {
    let cartsList = await cartManager.updateGetCartById(req.params.cid);

    if (cartsList.cart == null) {
      res.render("cart", { valid: false });
    } else {
      let newList = cartsList.products.map((product) => {
        let newProduct = product._doc.product;
        return newProduct;
      });
      res.render("cart", {
        id: cartsList._id,
        valid: newList.length,
        products: newList,
      });
    }
  } catch (error) {
    console.error(error);
  }
});

// POST Agregar un producto por id a un carrito especificado
router.post("/:cid/product/:pid/", async (req, res) => {
  try {
    let cartId = req.params.cid;
    let productId = req.params.pid;

    let cartWithProducts = await cartManager.addProductsInCart(
      cartId,
      productId
    );
    res.json(cartWithProducts);
  } catch (error) {
    console.error(error);
  }
});

//DELETE Product from cart
router.delete("/:cid/product/:pid/", async (req, res) => {
  try {
    let cartId = req.params.cid;
    let productId = req.params.pid;

    let cartWithProducts = await cartManager.deleteProductsInCart(
      cartId,
      productId
    );
    res.json(cartWithProducts);
  } catch (error) {
    console.error(error);
  }
});

//DELETE cart
router.delete("/:cid", async (req, res) => {
  try {
    let cartId = req.params.cid;

    let cartWithProducts = await cartManager.deleteCart(cartId);
    res.json(cartWithProducts);
  } catch (error) {
    console.error(error);
  }
});
// Put Mostar Carrito por ID y todos sus productos
router.put("/:cid", async (req, res) => {
  try {
    let cartsList = await cartManager.updateGetCartById(req.params.cid);
    res.json(cartsList);
    res.render("Cart", {
      cartsList,
    });
  } catch (error) {
    console.error(error);
  }
});

// PUT Actualizar quantity en un producto por id a un carrito especificado
router.put("/:cid/product/:pid/", async (req, res) => {
  try {
    let cartId = req.params.cid;
    let productId = req.params.pid;
    let quantity = req.body.quantity;
    console.log(req.body.quantity);

    let cartWithProducts = await cartManager.updateProductsInCart(
      cartId,
      productId,
      quantity
    );
    res.json(cartWithProducts);
  } catch (error) {
    console.error(error);
  }
});

export default router;
