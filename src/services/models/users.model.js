import mongoose from "mongoose";

const usersCollection = 'users';

const userScheme = new mongoose.Schema({
    first_name: String,
    last_name: String,
    age: Number,
    email: {
        type:String,
        unique: true,
        required: true
    },
    password: String,
    role: {
        type: String,
        default: "admin"
    },
    carts: {
        type: [
            {
                cart: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "carts"
                }
            }
        ],
        default: [],
        index: true,
    }
})

userScheme.pre('find', function() {
    this.populate("carts.cart");
});

const userModel = mongoose.model(usersCollection, userScheme)
export default userModel