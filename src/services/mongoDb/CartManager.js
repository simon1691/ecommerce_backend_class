import cartModel from "./models/carts.model.js";

export default class CartManager {
  constructor() {}

  getCarts = async () => {
    try {
      let cartsList = await cartModel.find();
      console.log(cartsList);
      return cartsList;
    } catch (error) {
      console.error(error);
    }
  };
  addCart = async (newCart) => {
    try {
      await cartModel.create(newCart);
      return newCart;
    } catch (error) {
      console.error(error);
    }
  };
  getCartById = async (cartId) => {
    try {
      let cart = await cartModel.find({ _id: cartId })
      return cart;
    } catch (error) {
      console.error(error);
    }
  };
  addProductsInCart = async (cartId, productId) => {
    try {
      let cart = await cartModel.findOne({ _id: cartId });
      let products = cart.products;

      if (products.length > 0) {
        let existingProduct = cart.products.find(
          (product) => product._id == productId
        );
        if (existingProduct) {
          await cartModel.updateOne(
            {_id: cartId},
            {$inc: {"products.$[product].quantity": 1}},
            {arrayFilters: [{"product._id": productId}]}
          );
          return { message: "Product already exists" };
        }
        cart.products.push(productId);
        await cartModel.updateOne({ _id: cartId }, cart);
        return cart;
      }
      cart.products.push(productId);
      await cartModel.updateOne({ _id: cartId }, cart);
      return cart;
    } catch (error) {
      console.error(error);
    }
  };
}
