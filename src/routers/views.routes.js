import { Router } from "express";
import ProductManager from "../services/dao/mongoDb/ProductManager.js";
import productModel from "../services/models/products.model.js";
import passport from "passport";
import { verifyJWT } from "../utils.js";

const router = Router();

const productManager = new ProductManager();

router.get("/login", async (req, res) => {
  res.render("login");
});

router.get("/register", async (req, res) => {
  res.render("register");
});

router.get("/", async (req, res) => {
  try {
    if (req.cookies['jwtCookieToken']) {
      let user = verifyJWT( req.cookies['jwtCookieToken'])
      console.log("desdee views", user)
      const productsList = await productManager.getProducts();
      res.render("home", {
        areProducts: productsList.length,
        productsList,
        user,
      });
    } else {
      res.render("login");
    }
  } catch (error) {
    console.error("Error: " + error);
  }
});

router.get("/products", passport.authenticate("jwt", { session:false }), async (req, res) => {
  try {
    let page = parseInt(req.query.page);
    let sort = req.query.sort;
    let sortBy = req.query.sortBy;
    let filterBy = req.query.filterBy;
    let filter = req.query.filter;
    let user = req.session.user;
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
    productsList.user = user;
    res.render("products", productsList);
    return;
  } catch (error) {
    console.error(error);
  }
});
export default router;
