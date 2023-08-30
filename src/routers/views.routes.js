import { Router } from "express";
import ProductManager from "../services/mongoDb/ProductManager.js";
import productModel from ".././services/mongoDb/models/products.model.js";

const router = Router();

const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const productsList = await productManager.getProducts();
    res.render("home", {
      areProducts: productsList.length,
      productsList,
    });
  } catch (error) {
    console.error("Error: " + error);
  }
});

router.get("/products", async (req, res) => {
  try {
    let page = parseInt(req.query.page);
    let sort = req.query.sort;
    let sortBy = req.query.sortBy;
    let filterBy = req.query.filterBy;
    let filter = req.query.filter;
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

    res.render("products", productsList);
    return;
  } catch (error) {
    console.error(error);
  }
});
export default router;
