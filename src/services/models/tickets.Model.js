import mongoose from "mongoose";

const ticketsCollection = 'ticket';

const ticketScheme = new mongoose.Schema({
    code: {
        type: String,
        default: () => Math.random().toString(36).substring(7),
    },
    purchase_datatime: {
        type: Date,
        default: Date.now()
    },
    amount: Number,
    purchaser: {
        type:String,
    }
})

const ticketModel = mongoose.model(ticketsCollection, ticketScheme)
export default ticketModel