import CartManagerServices from "../services/dao/mongoDb/CartManager.js";
import TicketManagerService from "../services/dao/mongoDb/TicketManager.js";
import { verifyJWT } from "../utils.js";

const cartManager = new CartManagerServices();
const ticketManager = new TicketManagerService();

export const getAllCarts = async (req, res) => {
  try {
    const allCarts = await cartManager.getCarts();
    res.send({ message: "Request Successful", payload: allCarts });
  } catch (error) {
    console.error("request error: " + error);
    res.status(500).send({ error: error });
  }
};

export const addCart = async (req, res) => {
  try {
    const newCart = await cartManager.addCart();
    res
      .status(201)
      .send({ payload: newCart });
  } catch (error) {
    console.error("request error: " + error);
    res.status(500).send({ error: error });
  }
};

export const getCartById = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cartFound = await cartManager.getCartById(cartId);
    if (cartFound.cart == null) {
      res.render("cart", { noCart: true });
    } else {
      let newList = cartFound.cart.products.map((product) => {
      let newProduct = product._doc.product;
      return newProduct;
      });
      res.render("cart", {
        id: cartFound.cart._id,
        valid: newList.length,
        products: newList,
        noCart: false
      });
    }
  } catch (error) {
    console.error("request error: " + error);
    res.status(500).send({ error: error });
  }
};

export const addProductsInCart = async (req, res) => {
  try {
    let cartId = req.params.cid;
    let productId = req.params.pid;
    let productsToAdd = await cartManager.addProductsInCart(cartId, productId);
    res
    .status(200)
    .send({ payload: productsToAdd });
  } catch (error) {
      console.error("request error: " + error);
      res.status(500).send({ error: error });
  }
}

export const deleteProductsInCart = async (req, res) => {
  try {
      let cartId = req.params.cid;
      let productId = req.params.pid;
      let productsToDelete = await cartManager.deleteProductsInCart(cartId, productId);
      res
      .status(200)
      .send({payload: productsToDelete });
    } catch (error) {
        console.error("request error: " + error);
        res.status(500).send({ error: error });
    }
}

export const deleteCart = async (req, res) => {
  try {
    let cartId = req.params.cid;
    let cartToDelete = await cartManager.deleteCart(cartId)
    res
    .status(200)
    .send({ payload: cartToDelete});
  } catch (error) {
      console.error("request error: " + error);
      res.status(500).send({ error: error });
  }
}

export const updateGetCartById = async (req, res) => {
  try {
    let cartId = req.params.cid;
    let cartToUpdate = await cartManager.updateGetCartById(cartId);
    
    if (cartToUpdate.cart == null) {
      res.render("cart", { noCart: true });
    } else {
      let newList = cartToUpdate.cart.products.map((product) => {
      let newProduct = product._doc.product;
      return newProduct;
      });
      res.render("cart", {
        id: cartToUpdate.cart._id,
        valid: newList.length,
        products: newList,
        noCart: false
      });
    }
  } catch (error) {
    console.error("request error: " + error);
    res.status(500).send({ error: error });
  }
}

export const updateProductsInCart = async (req, res) => {
  try {
    let cartId = req.params.cid;
    let productId = req.params.pid;
    let quantity = req.body.quantity;
    let productsToUpdate = await cartManager.updateProductsInCart(cartId, productId, quantity);
    res
    .status(200)
    .send({ payload: productsToUpdate });
  } catch (error) {
    console.error("request error: " + error);
    res.status(500).send({ error: error });
  }
}

export const purchaseOrder = async (req, res) => {
  try {
      let user = verifyJWT( req.cookies['jwtCookieToken'])
      let cartId = req.params.cid;
      let payload = await cartManager.purchaseOrder(cartId, user);
      res.status(200).send({payload})
  } catch (error) {
    console.error(error);
  }
};