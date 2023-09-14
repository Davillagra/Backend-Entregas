import mongoose from "mongoose"
const cartCollection = `carts`

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref:"products"
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ] 
})
cartSchema.pre("findOne", function () {
    this.populate("products.product")
})

export const cartModel = mongoose.model(cartCollection,cartSchema)