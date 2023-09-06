import { Router } from "express";
// import productManager from '../services/FileSystem/ProductManagerFiles.js'
import ProductManager from "../services/mongoDb/ProductManager.js";
import productModel from ".././services/mongoDb/models/products.model.js";

const router = Router();

const productManager = new ProductManager();

//GET
router.get("/", async (req, res) => {
  try {
    let limit = req.query.limit;
    let page = parseInt(req.query.page);
    let sort = req.query.sort;
    let sortBy = req.query.sortBy;
    let filterBy = req.query.filterBy;
    let filter = req.query.filter;
    let user = req.session.user
    let productsList = await productManager.getProducts(
      limit,
      sort,
      sortBy,
      filter,
      filterBy
    );
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
      productsList.user = user

      res.render("products", productsList);
      return;
    }
    res.render("home", {
      areProducts: productsList.length,
      productsList,
      user
    });
  } catch (error) {
    console.error(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const productsList = [];
    const productById = await productManager.getProductById(req.params.id);
    productsList.push(productById);
    res.render("home", {
      areProducts: productsList.length,
      productsList,
    });
  } catch (error) {
    console.error("Error: " + error);
  }
});

//POST
router.post("/", async (req, res) => {
  try {
    let prouctToAdd = req.body;
    await productManager.addProduct(prouctToAdd);
    res.json(prouctToAdd);
  } catch (error) {
    console.error(error);
  }
});

//PUT
router.put("/:pid", async (req, res) => {
  try {
    let productToUpdate = req.body;
    await productManager.updateProduct(req.params.pid, productToUpdate);
    res.json(productToUpdate);
  } catch (error) {
    console.error(error);
  }
});

//DELETE
router.delete("/:pid", async (req, res) => {
  try {
    let productToDelete = req.params.pid;
    await productManager.deleteProduct(req.params.pid);
    res.json(productToDelete);
  } catch (error) {
    console.error(error);
  }
});

export default router;
