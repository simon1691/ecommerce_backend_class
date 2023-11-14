import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productsCollections = 'products'

const  productSchema =  new mongoose.Schema({
    title: String,
    description: String,
    thumbnail: String,
    price: Number,
    code: {
        type: String,
        unique: true,
        required: true,
    },
    stock: Number,
    category: String,
    owner: {
        type: String,
        required: true,
        default: "admin"
    },
})
productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model(productsCollections, productSchema)
export default productModel