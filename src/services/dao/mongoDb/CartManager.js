import cartModel from "../../models/carts.model.js";
import ProductManagerService from "./ProductManager.js";
import ticketModel from "../../models/tickets.model.js";

const productManager = new ProductManagerService();

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
        products:[]
      });
      return {
        message: `New cart created successfully Cart ID: ${cart._id}`,
        cart
      };
    } catch (error) {
      console.error(error);
    }
  };

  //GET CART BY CART ID
  getCartById = async (cartId) => {
    try {
      let cart = await cartModel
        .findOne({ _id: cartId })
        .populate("products.product");
        console.log(cart)
      if (cart === null) {
        return { message: "Cart not found", cart};
      } else {
        let products = cart.products;
        if (!products.length) {
          return { message: "Cart is empty, lets add a product", cart};
        }
        return { message: "Cart found", cart};
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
        return { message: "Cart not found", cart};
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
            return { message: 'Product Quantity increased', cart};
          }
          products.push({ product: productId });
          await cartModel.updateOne({ _id: cartId }, { products });
          return { message: 'Product Added', cart};
        }
        products.push({ product: productId });
        await cartModel.updateOne({ _id: cartId }, { products });
        return { message: 'Product Added', cart};
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
        return { message: "Cart not found", cart: null };
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
            cart = await cartModel.findOne({ _id: cartId });
            return {message: 'Quantity decreased successfully', cart};
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
            return { message: "Cart is empty, lets add a product", cart};
          }
        } else {
          return {
            message:
              "The Product does not exists or was already removed from cart",
              cart
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
        return { message: "Cart not found", cart};
      } else {
        await cartModel.findOneAndDelete({ _id: cartId });
        return { message: "Cart and products deleted successfully", cart};
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
      if (cart === null) {
        return { message: "Cart not found", cart };
      } else {
        let products = cart.products;
        if (!products.length) {
          return { message: "Cart is empty, lets add a product", cart };
        }
        return { message: 'Cart Updated Successfully', cart };
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
        return { message: "Cart not found", cart };
      } else {
        let products = cart.products;
        if (products.length) {
          let existingProduct = products.find(
            (product) => product.product == productId
          );
          if (existingProduct) {
            await cartModel.updateOne(
              { _id: cartId },
              {
                $inc:
                  quantity !== undefined
                    ? { "products.$[product].quantity": quantity }
                    : { "products.$[product].quantity": 0 },
              },
              { arrayFilters: [{ "product._id": existingProduct._id }] }
            );
            cart = await cartModel.findOne({ _id: cartId });
            return cart;
          }
          products.push({ product: productId });
          await cartModel.updateOne({ _id: cartId }, { products });
          return {message: 'Quantity Updated successfully', cart};
        }
        products.push({ product: productId });
        await cartModel.updateOne({ _id: cartId }, { products });
        return {message: 'Quantity Updated successfully', cart};
      }
    } catch (error) {
      console.error(error);
    }
  };

    purchaseOrder = async (cartId) => {
    try {
      let cart = await cartModel
        .findOne({ _id: cartId })
        .populate("products.product").lean();
      if (cart === null) return { message: "Cart not found", cart};

      let products = cart.products;
      if (!products.length) return { message: "Cart is empty, lets add a product", cart};

     products = products.map((product) => {
        let productStock = product.product.stock;
        let quantity = product.quantity;
        let productId = product.product._id
        let stock = productStock - quantity

        console.log("test", productStock, quantity, stock)

        if(stock <= 0){
          console.log("productos sin stock", productId)
          // borra el producto que la cantidad supere el stock
          let productToRemove = products.findIndex(
            (product) => product._id === productId
          );
          products.splice(productToRemove);
        }else{
          console.log("ids de productos con stock", productId)          
          product.product.stock = productStock - quantity

          //Actualizar producto con la  nueva cantidad de stock
           productManager.updateProduct(productId, product.product)

          return product
        }
      })

      await cartModel.updateOne({ _id: cartId }, { products });

      return {message: 'Order Placed Successfully', cart};

    } catch (error) {
      console.error(error);
    }
  };
}