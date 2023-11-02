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
    let productsList = await productManager.getProducts(
      limit,
      sort,
      sortBy,
      filter,
      filterBy
    );
    if (!productsList || productsList.length === 0) {
      return CustomError.createError({
        name: "No products found",
        message: "No products found",
        code: EErrors.INVALID_TYPES,
        cause: "Unable to retrieve products from the database",
      });
    }
    // Page
    if (page) {
      let productsList = await productModel.paginate(
        filterBy ? { [filterBy]: filter } : "",
        { page, limit: 5, lean: true, sort: sort ? { [sortBy]: sort } : {} }
      );
      if (!productsList || productsList.length === 0) {
        return CustomError.createError({
          name: "No products found",
          message: "No products found",
          code: EErros.INVALID_TYPES,
          cause: "Unable to retrieve products from the database",
        });
      }
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
    req.logger.error(error.message);
  }
};

export const getProductById = async (req, res) => {
  try {
    const productsList = [];
    const productById = await productManager.getProductById(req.params.id);
    if (!productById) {
      CustomError.createError({
        name: "Invalid product ID",
        message:
          "The product with the given ID does not exist or is not available",
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
    req.logger.error({ error: error.code, message: error.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    let prouctToAdd = req.body;
    let newProduct = await productManager.addProduct(prouctToAdd);

    //check if the new product was not created
    if (newProduct.status != "success") {
      CustomError.createError({
        name: "No product data provided",
        message: newProduct.codeExists
          ? "The product with the given code already exists"
          : "The product data provided is not valid",
        code: EErrors.INVALID_TYPES,
        cause:
          "The product data provided is not valid so the product could not be saved or created",
      });
    }
    res.status(200).send({ payload: newProduct });
  } catch (error) {
    req.logger.error({ error: error.code, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    let productToUpdate = req.body;
    console.log(productToUpdate);
    if(Object.keys(productToUpdate).length === 0) {
      req.logger.warning("there is not any product data to update");
    }
    await productManager.updateProduct(req.params.pid, productToUpdate);
    res.json(productToUpdate);
  } catch (error) {
    req.logger.error(error.message);
  }
};

export const deleteProduct = async (req, res) => {
  try {

    let productToDelete = await productManager.deleteProduct(req.params.pid);
    
    //check if the new product was not deleted
    if (productToDelete.status != "success") {
      CustomError.createError({
        name: "Product not deleted",
        message: "The product with the given ID could not be deleted",
        code: EErrors.INVALID_TYPES,
        cause:
          "The product with the given ID could not be deleted",
      });
    }
    res.status(200).send({ payload: productToDelete });
  } catch (error) {
    req.logger.error(error.message);
  }
};
