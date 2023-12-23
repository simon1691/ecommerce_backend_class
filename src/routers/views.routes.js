import { Router } from "express";
import ProductManager from "../services/dao/mongoDb/ProductManager.js";
import CartManager from "../services/dao/mongoDb/CartManager.js";

import productModel from "../services/models/products.model.js";
import passport from "passport";
import { verifyJWT } from "../utils.js";
import {authenticateJWT} from "../middlewares/authenticateJWT.js";

const router = Router();

const productManager = new ProductManager();
const cartManager = new CartManager()

router.get("/login", async (req, res) => {
  res.render("login");
});

router.get("/register", async (req, res) => {
  res.render("register");
});

router.get("/restore-pass/:email", async (req, res) => {
  res.render("restorePass");
});

router.get("/", async (req, res) => {
  try {
    if (req.cookies['jwtCookieToken']) {
      let user = verifyJWT( req.cookies['jwtCookieToken'])
      let userCartId = user.carts[0]._id
      const productsList = await productManager.getProducts();
      const productsInCart = await cartManager.getCartById(userCartId);
      res.render("home", {
        areProducts: productsList.length,
        productsList,
        user,
        productsInCart : productsInCart.products.length > 0 ? true : false
      });
    } else {
      res.render("login");
    }
  } catch (error) {
    console.error("Error: " + error);
  }
});




router.get("/products", authenticateJWT, async (req, res) => {
  try {
    let page = parseInt(req.query.page);
    let sort = req.query.sort;
    let sortBy = req.query.sortBy;
    let filterBy = req.query.filterBy;
    let filter = req.query.filter;
    let user = req.session.user;
    let userCartId = user.carts[0]._id
    const productsInCart = await cartManager.getCartById(userCartId);
    // Page
    if (!page) page = 1;
    let productsList = await productModel.paginate(
      filterBy ? { [filterBy]: filter } : "",
      { page, limit: 5, lean: true, sort: sort ? { [sortBy]: sort } : {} }
    );
    productsList.prevLink = productsList.hasPrevPage
      ? `http://localhost:8181/products/?page=${productsList.prevPage}`
      : null;
    productsList.nextLink = productsList.hasNextPage
      ? `http://localhost:8181/products/?page=${productsList.nextPage}`
      : null;
    productsList.areProducts = !(page <= 0 || page > productsList.totalPages);
    productsList.user = user;
    res.render("products", {
      areProducts: productsList.length,
      productsList,
      user,
      productsInCart : productsInCart.products.length > 0 ? true : false
    });
    return;
  } catch (error) {
    console.error(error);
  }
});


// cart View
router.get("/cart/:id", authenticateJWT, async (req, res) => {
  try {
    let user = verifyJWT( req.cookies['jwtCookieToken'])
    let cartId = req.params.id;
    let cart = await cartManager.getCartById(cartId);
    let productsInCart = cart.products.map((product) => {
      product.total = product.quantity * product.product.price;
      return product;
    })
    console.log(productsInCart)
    res.render("cart", {productsInCart, user, url: `/cart/${cartId}` ? false : true });
    console.log
  } catch (error) {
    console.error(error);
    if (error.name === "UnauthorizedError") {
      // Redirect to the login page if the user is not authenticated
      return res.redirect("/login");
    } else {
      // Handle other errors
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});
export default router;

