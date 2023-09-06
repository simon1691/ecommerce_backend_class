import { Router } from "express";
import ProductManager from "../services/mongoDb/ProductManager.js";
import productModel from ".././services/mongoDb/models/products.model.js";

const router = Router();

const productManager = new ProductManager();

router.get('/login', async (req, res) => {
  res.render("login")
})

router.get('/register', async (req, res) => {
  res.render("register")
})

router.get("/", async (req, res) => {
  try {
    if(req.session.user){
      const productsList = await productManager.getProducts();
      const user = req.session.user
      console.log(user)
      res.render("home", {
        areProducts: productsList.length,
        productsList,
        user
      })
    }else{
      res.render("login");
    }
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
    let user = req.session.user
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
      productsList.user = user
      console.log(productsList)
    res.render("products",
      productsList
      );
    return;
  } catch (error) {
    console.error(error);
  }
});
export default router;
