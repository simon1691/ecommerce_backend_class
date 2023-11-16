import { verifyJWT } from "../utils.js";
import ProductManagerService from "../services/dao/mongoDb/ProductManager.js";
import CustomError from "../services/errors/customError.js";
import { EErrors } from "../services/errors/errors-enum.js";

const productManager = new ProductManagerService();

export const getProducts = async (req, res) => {
  try {
    let limit = req.query.limit;
    let page = parseInt(req.query.page);
    let sort = req.query.sort;
    let sortBy = req.query.sortBy;
    let filterBy = req.query.filterBy;
    let filter = req.query.filter;
    let user = req.session.user;

    req.logger.info("Calling the products");

    let productsList = await productManager.getProducts(
      limit,
      sort,
      sortBy,
      filter,
      filterBy
    );

    productsList.length === 0
      ? req.logger.info("No products in list")
      : req.logger.info("Products in list");

    // Page
    if (page) {
      let productsList = await productModel.paginate(
        filterBy ? { [filterBy]: filter } : "",
        { page, limit: 5, lean: true, sort: sort ? { [sortBy]: sort } : {} }
      );
      productsList.prevLink = productsList.hasPrevPage
        ? `http://localhost:8181/api/products/?page=${productsList.prevPage}`
        : null;
      productsList.nextLink = productsList.hasNextPage
        ? `http://localhost:8181/api/products/?page=${productsList.nextPage}`
        : null;
      productsList.areProducts = !(page <= 0 || page > productsList.totalPages);
      productsList.user = user;

      res.render("products", productsList);
      return;
    }
    res.render("home", {
      areProducts: productsList.length,
      productsList,
      user,
    });
  } catch (error) {
    req.logger.error(error.message, {
      stack: error.stack,
    });
  }
};

export const addProduct = async (req, res) => {
  try {
    let owner = verifyJWT(req.cookies["jwtCookieToken"]);
    let { title, description, thumbnail, price, code, stock, category } =
      req.body;

    // check if any value is empty and throw and error
    if (
      !title ||
      !description ||
      !thumbnail ||
      !price ||
      !code ||
      !stock ||
      !category
    ) {
      res.status(400).send({
        payload: {
          message: "Please fill all the required fields",
          success: false,
        },
      });
      CustomError.createError({
        name: "Missing Product Data",
        message:
          "The Information  provided to add a new product is missing one or more of the required fields",
        code: EErrors.INVALID_TYPES,
        cause:
          "The product data is not valid one or more product fields are missing",
      });
    }

    let newProduct = await productManager.addProduct({
      title,
      description,
      thumbnail,
      price,
      code,
      stock,
      category,
      owner: owner.email,
    });

    if (!newProduct) {
      req.logger.warning("Product Already Exists");
      res.status(400).send({
        payload: {
          message: "Product Already Exists",
          success: false,
        },
      });
      return;
    }
    req.logger.info(`New Product Added ${newProduct}`);

    res.status(201).send({
      payload: {
        product: newProduct,
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

export const getProductById = async (req, res) => {
  try {
    const productsList = [];
    const productById = await productManager.getProductById(req.params.id);

    //validates that the id returns a product
    if (!productById) {
      res.status(400).send({
        payload: {
          message: "The product not found",
          success: false,
        },
      });
      CustomError.createError({
        name: "Invalid product ID",
        message: "The product with the given ID does not exist",
        code: EErrors.INVALID_TYPES,
        cause: "Unable to retrieve products with the given ID",
      });
    }
    productsList.push(productById);
    res.render("home", {
      areProducts: productsList.length,
      productsList,
    });
  } catch (error) {
    req.logger.error(error.name, {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    let product = req.body;
    let productId = req.params.pid;
    let productUpdated = await productManager.updateProduct(productId, product);

    if (!productUpdated) {
      res.status(400).send({
        payload: {
          message: "The product not found",
          success: false,
        },
      });
      CustomError.createError({
        name: "Invalid product ID",
        message: "The product with the given ID does not exist",
        code: EErrors.INVALID_TYPES,
        cause: "Unable to retrieve products with the given ID",
      });
    }

    res.status(201).send({
      payload: {
        message: "Product Updated Successfully",
        success: true,
        product: {
          id: productUpdated._id,
          ProductName: productUpdated.title,
        },
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

export const deleteProduct = async (req, res) => {
  try {
    let owner = verifyJWT(req.cookies["jwtCookieToken"]);
    let productId = req.params.pid;
    let productToDelete;

    if (owner.role === "premium") {
      productToDelete = await productManager.getProductById(productId);
      if (productToDelete) {
        if(productToDelete.owner === owner.email) {
          productToDelete = await productManager.deleteProduct(productId);
        }else {
          res.status(400).send({
            payload: {
              message: "This product is not owned by you",
              success: false,
            },
          });
          CustomError.createError({
            name: "Ownership product",
            message: `This product is not owned by the ${owner.role} user`,
            code: EErrors.INVALID_TYPES,
            cause: "The product is not owned by the user"
          });
        }
      }
    } else {
      productToDelete = await productManager.deleteProduct(productId);
    }

    if (!productToDelete) {
      res.status(400).send({
        payload: {
          message: "Product could not be deleted, or it does not exist",
          success: false,
        },
      });
      CustomError.createError({
        name: "Product not deleted",
        message: "The product with the given ID could not be deleted",
        code: EErrors.INVALID_TYPES,
        cause: "The product with the given ID could not be deleted",
      });
    }
    res.status(200).send({
      payload: {
        message: "Product Deleted Successfully",
        success: true,
        product: {
          id: productToDelete._id,
          product: productToDelete.title,
        },
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
