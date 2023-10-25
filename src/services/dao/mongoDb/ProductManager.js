import productModel from "../../models/products.model.js";

export default class ProductManagerService {
  constructor() {}

  addProduct = async (product) => {
    try {
      //check if the product code was provided
      if (product.code === undefined || product.code === null) {
        return {
          status: "error",
          codeExists: false,
        };
      }
      //check if the product code already exists
      let productExists = await productModel.findOne({ code: product.code });
      if (productExists) {
        return {
          status: "error",
          codeExists: true,
        };
      }
      // if all goes well, create the new product
      const newProduct = await productModel.create(product);
      return {
        message: `New product added successfully Product ID: ${newProduct._id}`,
        status: "success",
        product: newProduct,
      };
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
      await productModel.deleteOne({ _id: id }).lean();
      return {
        message: "Product deleted successfully!",
        status: "success",
      };
    } catch (error) {
      console.error("error " + error);
    }
  };
}
