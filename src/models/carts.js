import mongoose from "mongoose"
const cartCollection = `carts`

const cartSchema = new mongoose.Schema({
    products: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ]
})

export const cartModel = mongoose.model(cartCollection,cartSchema)