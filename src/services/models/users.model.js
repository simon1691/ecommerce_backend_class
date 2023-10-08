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
    password: String
})

const userModel = mongoose.model(usersCollection, userScheme)
export default userModel