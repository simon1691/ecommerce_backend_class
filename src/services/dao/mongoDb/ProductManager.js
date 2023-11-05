import productModel from "../../models/products.model.js";

export default class ProductManagerService {
  constructor() {}

  getProducts = async (req, res, limit, sort, sortBy, filter, filterBy) => {
    try {
      let productsList = await productModel
        .find(filter ? { [filterBy]: filter } : {})
        .limit(limit)
        .sort(sort ? { [sortBy]: sort } : {})
        .lean();
      return productsList;
    } catch (error) {
      console.error("error " + error);
    }
  };
  addProduct = async (product) => {
    try {
      //check if the product code already exists
      let productExists = await productModel.findOne({ code: product.code });
      // if product does not Exists, create the new product
      if (!productExists) {
        const newProduct = await productModel.create(product);
        return newProduct;
      }
      return;
    } catch (error) {
      console.error("error " + error);
    }
  };
  getProductById = async (id) => {
    try {
      const productById = await productModel.findOne({ _id: id }).lean();
      return productById;
    } catch (error) {
      console.error("error " + error);
    }
  };
  updateProduct = async (id, product) => {
    try {
      const productById = await productModel.findOne({ _id: id }).lean();
      // If product can be found return undefined
      if (!productById) {
        return undefined;
      }
      let productUpdated = await productModel
        .findOneAndUpdate({ _id: id }, product)
        .lean();
      return productUpdated;
    } catch (error) {
      console.error("error " + error);
    }
  };
  deleteProduct = async (id) => {
    try {
      let productToDelete = await productModel.findOne({ _id: id }).lean();
      await productModel.deleteOne({ _id: id }).lean();
      return productToDelete;
    } catch (error) {
      console.error("error " + error);
    }
  };
}
