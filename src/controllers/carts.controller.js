import CartManagerServices from "../services/dao/mongoDb/CartManager.js";
import CustomError from "../services/errors/customError.js";
import { EErrors } from "../services/errors/errors-enum.js";
import { verifyJWT } from "../utils.js";

const cartManager = new CartManagerServices();

export const getAllCarts = async (req, res) => {
  try {
    req.logger.info("Calling List of Carts");
    const allCarts = await cartManager.getCarts();
    if (allCarts.length === 0) {
      req.logger.warning("Carts list empty");
      res.status(200).send();
      return;
    }
    req.logger.info("Carts list Loaded");
    res.send({ message: "Request Successful", payload: allCarts });
    return;
  } catch (error) {
    req.logger.error(error.message, {
      code: error.code,
      stack: error.stack,
    });
  }
};

export const addCart = async (req, res) => {
  try {
    const newCart = await cartManager.addCart();
    if (!newCart) {
      res.status(400).send({
        payload: {
          message: "Cart could not be added",
          success: false,
        },
      });
      CustomError.createError({
        name: "Cart not added",
        message: "The cart could not be added",
        code: EErrors.DATABASE_ERROR,
        cause: "The cart could not be added",
      });
    }
    res.status(201).send({
      payload: {
        success: true,
        cartAdded: newCart,
      },
    });
  } catch (error) {
    req.logger.error(error.name, {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
  }
};

export const getCartById = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cartFound = await cartManager.getCartById(cartId);

    if (!cartFound) {
      res.status(400).send({
        payload: {
          message: "Cart could not be found by the ID provided",
          success: false,
        },
      });
      CustomError.createError({
        name: "Cart not Found by ID",
        message: "Cart could not be found by the ID provided",
        code: EErrors.INVALID_TYPES,
        cause: "The Id provided does not exist in the database",
      });
    }
    req.logger.info(`Cart found: ${cartFound._id}`);

    if (!cartFound.products.length) {
      req.logger.info("Cart is empty, lets add a product");
      res.status(200).send({
        payload: {
          message: "Cart is empty, lets add a product",
          cart: cartFound,
          success: true,
        },
      });
      return;
    }
    res.status(200).send({
      payload: {
        message: "Cart Found",
        cart: cartFound,
        success: true,
      },
    });
  } catch (error) {
    req.logger.error(error.name, {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
  }
};

export const addProductsInCart = async (req, res) => {
  try {
    let owner = verifyJWT(req.cookies["jwtCookieToken"]);
    let cartId = req.params.cid;
    let productId = req.params.pid;
    let productsToAdd = await cartManager.addProductsInCart(cartId, productId, owner.email);

    if (!productsToAdd || productsToAdd.ownershipError) {
      res.status(400).send({
        payload: {
          message: productsToAdd.ownershipError ? "You own this product therefore it can be added to this cart" : "Product could not be added",
          success: false,
          ownershipError: productsToAdd.ownershipError ? true : false,
        },
      });
      CustomError.createError({
        name: "No products to add",
        message: "The products could not be added some inf is missing",
        code: EErrors.INVALID_TYPES,
        cause: "The IDs, provided do not exist in the database",
      });
    }

    req.logger.info({
      message: productsToAdd.message,
      productId: productId,
      cartId: cartId,
    });

    res.status(200).send({
      payload: {
        message: `Product: ${productId}, ${productsToAdd.message}`,
        cartId: cartId,
        productId: productId,
        success: true,
      },
    });
  } catch (error) {
    req.logger.error(error.name, {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
  }
};

export const deleteProductsInCart = async (req, res) => {
  try {
    let cartId = req.params.cid;
    let productId = req.params.pid;
    let productsToDelete = await cartManager.deleteProductsInCart(
      cartId,
      productId
    );

    if (!productsToDelete) {
      res.status(400).send({
        payload: {
          message: "Product could not be Deleted",
          success: false,
        },
      });
      CustomError.createError({
        name: "No products to add",
        message: "The products could not be Deleted some inf is missing",
        code: EErrors.INVALID_TYPES,
        cause: "The IDs, provided do not exist in the database",
      });
    }

    req.logger.info({
      message: productsToDelete.message,
      productId: productId,
      cartId: cartId,
    });

    res.status(200).send({
      payload: {
        message: `Product: ${productId}, ${productsToDelete.message}`,
        cartId: cartId,
        productId: productId,
        success: true,
      },
    });
  } catch (error) {
    req.logger.error(error.name, {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
  }
};

export const deleteCart = async (req, res) => {
  try {
    let cartId = req.params.cid;
    let cartToDelete = await cartManager.deleteCart(cartId);
    if (!cartToDelete) {
      res.status(400).send({
        payload: {
          message: "Cart could not be Deleted",
          success: false,
        },
      });
      CustomError.createError({
        name: "Cart no deleted",
        message: "The cart could not be deleted",
        code: EErrors.INVALID_TYPES,
        cause: "The ID provided do not exist in the database",
      });
    }
    res.status(200).send({
      payload: {
        cartId: cartToDelete._id,
        success: true,
      },
    });
  } catch (error) {
    req.logger.error(error.name, {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
  }
};

export const updateGetCartById = async (req, res) => {
  try {
    let cartId = req.params.cid;
    let cartToUpdate = await cartManager.updateGetCartById(cartId);

    if (!cartToUpdate) {
      res.status(400).send({
        payload: {
          message: "Cart could not be Updated",
          success: false,
        },
      });
      CustomError.createError({
        name: "Cart no Updated",
        message: "The cart could not be Updated",
        code: EErrors.INVALID_TYPES,
        cause: "The ID provided do not exist in the database",
      });
    }
    res.status(200).send({
      payload: {
        message: "Cart Updated",
        cartId: cartToUpdate,
        success: true,
      },
    });
  } catch (error) {
    req.logger.error(error.name, {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
  }
};

export const updateProductsInCart = async (req, res) => {
  try {
    let cartId = req.params.cid;
    let productId = req.params.pid;
    let quantity = req.body.quantity;

    if (!quantity) {
      res.status(400).send({
        payload: {
          message: "Quantity not specified",
          success: false,
        },
      });
      CustomError.createError({
        name: "Quantity not specified",
        message: "Quantity not specified",
        code: EErrors.INVALID_TYPES,
        cause: "Quantity not specified",
      });
    }

    let productsToUpdate = await cartManager.updateProductsInCart(
      cartId,
      productId,
      quantity
    );

    if (!productsToUpdate) {
      res.status(400).send({
        payload: {
          message: "Product could not be Updated",
          success: false,
        },
      });
      CustomError.createError({
        name: "Product no Updated",
        message: "The product could not be Updated",
        code: EErrors.INVALID_TYPES,
        cause: "Some of the information provided do not exist in the database",
      });
    }
    res.status(200).send({
      payload: {
        message: "Quantity Updated",
        productUpdated: productId,
        cart: cartId,
        success: true,
      },
    });
  } catch (error) {
    req.logger.error(error.name, {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
  }
};

export const purchaseOrder = async (req, res) => {
  try {
    let user = verifyJWT(req.cookies["jwtCookieToken"]);
    let cartId = req.params.cid;

    if (!user || !cartId) {
      res.status(400).send({
        payload: {
          message: "User or Cart ID not specified",
          success: false,
        },
      });
      CustomError.createError({
        name: "User or Cart ID not specified",
        message: "User or Cart ID not specified",
        code: EErrors.INVALID_TYPES,
        cause: "User or Cart ID not specified",
      });
    }
    let purchaseOrder = await cartManager.purchaseOrder(cartId, user);

    if (!purchaseOrder || !purchaseOrder.ticket) {
      res.status(400).send({
        payload: {
          message: "Order could not be created",
          success: false,
        },
      });
      CustomError.createError({
        name: "Order could not be created",
        message: "Order could not be created",
        code: EErrors.INVALID_TYPES,
        cause: "Order could not be created",
      });
    }

    // validations Products in cart
    let products = purchaseOrder.cart.products;
    if (!products.length) {
      res.status(400).send({
        payload: {
          message: "Cart is empty, lets add a product",
          success: false,
          cart: purchaseOrder.cart._id,
        },
      });
      return;
    }

    res.status(200).send({
      payload: {
        message: "Order Created",
        ticket: purchaseOrder.ticket,
        cart: cartId,
        success: true,
      },
    });
  } catch (error) {
    req.logger.error(error.name, {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
  }
};
