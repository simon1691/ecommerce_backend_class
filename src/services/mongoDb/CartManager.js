import cartModel from "./models/carts.model.js";

export default class CartManager {
  constructor() {}

  //GET ALL CARTS LIST
  getCarts = async () => {
    try {
      let cartsList = await cartModel.find();
      return cartsList;
    } catch (error) {
      console.error(error);
    }
  };

  //CREATE A CART
  addCart = async (newCart) => {
    try {
      await cartModel.create(newCart);
      console.log(newCart);
      return { message: "New cart created successfully" };
    } catch (error) {
      console.error(error);
    }
  };

  //GET CART BY CART ID
  getCartById = async (cartId) => {
    try {
      let cart = await cartModel.findOne({ _id: cartId }).populate("products.product");;
      if (cart === null) {
        return { message: "Cart not found", cart : null};
      } else {
        let products = cart.products;

        if (!products.length) {
          return { message: "Cart is empty, lets add a product", cart : null };
        }
        return cart;
      }
    } catch (error) {
      console.error(error);
    }
  };

  //ADD PRODUCTS TO THE CART
  addProductsInCart = async (cartId, productId) => {
    try {
      let cart = await cartModel.findOne({ _id: cartId });
      if (cart === null) {
        return { message: "Cart not found" };
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
            return cart;
          }
          products.push({ product: productId });
          await cartModel.updateOne({ _id: cartId }, { products });
          return cart;
        }
        products.push({ product: productId });
        await cartModel.updateOne({ _id: cartId }, { products });
        return cart;
      }
    } catch (error) {
      console.error(error);
    }
  };

  //DELETE A Product and a cart when cart is empty
  deleteProductsInCart = async (cartId, productId) => {
    try {
      let cart = await cartModel.findOne({ _id: cartId });
      if (cart === null) {
        return { message: "Cart not found" };
      } else {
        let products = cart.products;
        let existingProduct = products.find(
          (product) => product.product == productId
        );
        if (existingProduct) {
          if (existingProduct.quantity > 1) {
            await cartModel.updateOne(
              { _id: cartId },
              { $inc: { "products.$[product].quantity": -1 } },
              { arrayFilters: [{ "product._id": existingProduct._id }] }
            );
            cart = cartModel.find({ _id: cartId });
            return cart;
          } else {
            let productToRemove = products.findIndex(
              (product) => product._id === productId
            );
            products.splice(productToRemove);
            if (products.length) {
              cartModel.findOneAndDelete({ _id: existingProduct.product });
              await cartModel.updateOne({ _id: cartId }, { products });
              return {
                message: `this Product was removed from cart: ${productId}`,
                cart,
              };
            }
            await cartModel.updateOne({ _id: cartId }, { products });
            return { message: "Cart is empty, lets add a product" };
          }
        } else {
          return {
            message:
              "The Product does not exists or was already removed from cart",
          };
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  //DELETE A CART
  deleteCart = async (cartId) => {
    try {
      let cart = await cartModel.findOne({ _id: cartId });
      if (cart === null) {
        return { message: "Cart not found" };
      } else {
        await cartModel.findOneAndDelete({ _id: cartId });
        return { message: "Cart and products deleted successfully" };
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  //Actualizar carrito con los productos nuevos luego de borrar alguno
  updateGetCartById = async (cartId) => {
    try {
      let cart = await cartModel.findOne({ _id: cartId }).populate("products.product");
      if (cart === null) {
        return { message: "Cart not found" };
      } else {
        let products = cart.products;

        if (!products.length) {
          return { message: "Cart is empty, lets add a product" };
        }
        return cart;
      }
    } catch (error) {
      console.error(error);
    }
  };

    //ADD PRODUCTS TO THE CART
    updateProductsInCart = async (cartId, productId, quantity) => {
      try {
        let cart = await cartModel.findOne({ _id: cartId });
        if (cart === null) {
          return { message: "Cart not found" };
        } else {
          let products = cart.products;
          if (products.length) {
            let existingProduct = products.find(
              (product) => product.product == productId
            );
            if (existingProduct) {
              await cartModel.updateOne(
                { _id: cartId },
                { $inc: quantity !== undefined ? { "products.$[product].quantity": quantity } : { "products.$[product].quantity": 0 }},
                { arrayFilters: [{ "product._id": existingProduct._id }] }
              );
              cart = await cartModel.findOne({ _id: cartId });
              return cart;
            }
            products.push({ product: productId });
            await cartModel.updateOne({ _id: cartId }, { products });
            return cart;
          }
          products.push({ product: productId });
          await cartModel.updateOne({ _id: cartId }, { products });
          return cart;
        }
      } catch (error) {
        console.error(error);
      }
    };
}
