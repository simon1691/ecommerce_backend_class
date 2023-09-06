import productModel from "./models/products.model.js";

export default class ProductManager {
  constructor() {}

  addProduct = async (product) => {
    try {
      await productModel.create(product);
      return product
    } catch (error) {
      console.error("error " + error);
    }
  };
  getProducts = async (limit, sort, sortBy, filter, filterBy) => {
    try {
      if (filter) {
        let productsList = await productModel
          .find({ [filterBy]: filter })
          .limit(limit)
          .sort({ [sortBy]: sort })
          .lean();
        return productsList;
      }
      let productsList = await productModel
        .find()
        .limit(limit)
        .sort(sort ? { [sortBy]: sort } : {})
        .lean();
      return productsList;
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
      const productToUpdate = await productModel
        .findOneAndUpdate({ _id: id }, product)
        .lean();
      return productToUpdate;
    } catch (error) {
      console.error("error " + error);
    }
  };
  deleteProduct = async (id) => {
    try {
      const productToDelete = await productModel.deleteOne({ _id: id }).lean();
      return productToDelete;
    } catch (error) {
      console.error("error " + error);
    }
  };
}
