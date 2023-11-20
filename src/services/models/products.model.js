import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productsCollections = 'products'

const  productSchema =  new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    thumbnail: String,
    price:  {
        type: Number,
        required: true
    },
    code: {
        type: String,
        unique: true,
        required: true,
    },
    stock: {
        type: Number,
        required: true
    },
    category:  {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true,
        default: "admin"
    },
})
productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model(productsCollections, productSchema)
export default productModel