import mongoose from "mongoose";

const cartsCollections = 'carts'

const  cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
                },
                quantity: {type:Number, default: 1}
            }
        ],
        default: [],
        index: true,
    }
})
cartSchema.pre('find', function() {
    this.populate("products.product");
});
const cartModel = mongoose.model(cartsCollections, cartSchema)
export default cartModel