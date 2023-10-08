import ProductManagerService from "../services/dao/mongoDb/ProductManager.js";

const productManager = new ProductManagerService();

export const getProducts = async (req, res) => {
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
}

export const getProductById = async (req, res) => {
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
}

export const addProduct = async (req, res) => {
  try {
    let prouctToAdd = req.body;
    await productManager.addProduct(prouctToAdd);
    res.json(prouctToAdd);
  } catch (error) {
    console.error(error);
  }
}

export const updateProduct = async (req, res) => {
  try {
    let productToUpdate = req.body;
    await productManager.updateProduct(req.params.pid, productToUpdate);
    res.json(productToUpdate);
  } catch (error) {
    console.error(error);
  }
}

export const deleteProduct = async (req, res) => {
  try {
    let productToDelete = req.params.pid;
    await productManager.deleteProduct(req.params.pid);
    res.json(productToDelete);
  } catch (error) {
    console.error(error);
  }
}