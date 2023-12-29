import cartModel from "../../models/carts.model.js";
import ProductManagerService from "./ProductManager.js";
import TicketManagerService from "./TicketManager.js";

const productManager = new ProductManagerService();
const ticketManager = new TicketManagerService();

export default class CartManagerService {
  constructor() {}

  //GET ALL CARTS LIST
  getCarts = async () => {
    try {
      let cartsList = await cartModel.find();
      return cartsList.map((cart) => cart.toObject());
    } catch (error) {
      console.error(error);
    }
  };

  //CREATE A CART
  addCart = async () => {
    try {
      const cart = await cartModel.create({
        products: [],
      });
      return cart;
    } catch (error) {
      console.error(error);
    }
  };

  //GET CART BY CART ID
  getCartById = async (cartId) => {
    try {
      let cart = await cartModel
        .findOne({ _id: cartId })
        .populate("products.product")
        .lean();

        console.log(cart);
      return cart;
    } catch (error) {
      console.error(error);
    }
  };

  //ADD PRODUCTS TO THE CART
  addProductsInCart = async (cartId, productId, owner) => {
    try {
      let cart = await cartModel.findOne({ _id: cartId });
      let product = await productManager.getProductById(productId);
      if(product.owner === owner) {
        return {ownershipError: true}
      }
      if (cart === null || product === null) {
        return cart;
      } else {
        let products = cart.products;
        if (products.length) {
          let existingProduct = products.find(
            (product) => product.product == productId
          );
          if (existingProduct) {
            await cartModel.updateOne(
              { _id: cartId },
              { $inc: { "products.$[product].quantity": 1 } },
              { arrayFilters: [{ "product._id": existingProduct._id }] }
            );
            cart = await cartModel.findOne({ _id: cartId });
            return { message: "Product Quantity increased", cart };
          }
          products.push({ product: productId });
          await cartModel.updateOne({ _id: cartId }, { products });
          return { message: "Product Added", cart };
        }
        products.push({ product: productId });
        await cartModel.updateOne({ _id: cartId }, { products });
        return { message: "Product Added", cart };
      }
    } catch (error) {
      console.error(error);
    }
  };



  deleteProductsInCart = async (cartId, productId) => {
    try {
      let cart = await cartModel
      .findOne({ _id: cartId })
      .populate("products.product")
      .lean();

      if (cart === null || productId === null) return cart;

      let products = cart.products;
      products = products.filter(product => product.product._id.toString() !== productId);

      await cartModel.updateOne({ _id: cartId }, { products });
      return cart
    
    } catch (error) {
      console.error(error);
    }
  }

  //DELETE A CART
  deleteCart = async (cartId) => {
    try {
      let cart = await cartModel.findOne({ _id: cartId });
      if (cart === null) {
        return cart;
      } else {
        await cartModel.findOneAndDelete({ _id: cartId });
        return cart;
      }
    } catch (error) {
      console.error(error);
    }
  };

  //Actualizar carrito con los productos nuevos luego de borrar alguno
  updateGetCartById = async (cartId) => {
    try {
      let cart = await cartModel
        .findOne({ _id: cartId })
        .populate("products.product");

      if (cart === null) return cart;
      return cart;
    } catch (error) {
      console.error(error);
    }
  };

  //ADD PRODUCTS TO THE CART
  updateProductsInCart = async (cartId, productId, quantity) => {
    try {
      let cart = await cartModel.findOne({ _id: cartId })
      .populate("products.product")
      .lean();
      if (cart === null) {
        cart;
      } else {
        let products = cart.products;
        if (products.length) {

          products.forEach((product) => {
            console
            if (product.product._id.toString() === productId) {
              product.quantity = quantity;
            }
          })

          await cartModel.updateOne({ _id: cartId }, { products });
          return cart;
        }
        await cartModel.updateOne({ _id: cartId }, { products });
        return cart;
      }
    } catch (error) {
      console.error(error);
    }
  };

  purchaseOrder = async (cartId, user) => {
    try {
      let cart = await cartModel.findOne({ _id: cartId })
        .populate("products.product")
        .lean();
      //validations cart
      if (!cart) return cart;

      let products = cart.products;

      let productsWithStock = products.filter(
        (product) => product.product.stock >= product.quantity
      );
      let productsWithoutStock = products.filter(
        (product) => product.product.stock < product.quantity
      );

      let purchaser = user;
      let cartTotalAmount = productsWithStock.reduce(
        (acc, product) => acc + product.quantity * product.product.price,
        0
      );

      if (productsWithStock.length > 0) {
        productsWithStock.forEach((product) => {
          product.product.stock = product.product.stock - product.quantity;
          // Actualiza el stock del producto con la nueva cantidad de stock
          productManager.updateProduct(product.product._id, product.product);
        });
        // Deja en el carrito solo los productos que no se pudieron procesar
        if (productsWithoutStock.length > 0) {
          products = productsWithoutStock;
        }

        let ticket = await ticketManager.createTicket({
          amount: cartTotalAmount,
          purchaser: purchaser.email,
        });

        await cartModel.updateOne({ _id: cartId }, { products: products });

        return { ticket, cart };
      }

      if (productsWithoutStock.length > 0) {
        products = productsWithoutStock;
        cartModel.updateOne({ _id: cartId }, { products: products });
        return cart;
      }
    } catch (error) {
      console.error(error);
    }
  };
}
