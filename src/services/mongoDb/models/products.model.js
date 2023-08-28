import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productsCollections = 'products'

const  productSchema =  mongoose.Schema({
    title: String,
    desciption: String,
    thumbnail: String,
    price: Number,
    code: {
        type: String,
        unique: true,
        required: true,
    },
    stock: Number
})
productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model(productsCollections, productSchema)
export default productModel