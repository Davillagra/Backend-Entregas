import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2";
const productCollection = `products`

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        validate: {
            validator: function(value) {
                return value >= 0;
            },
            message: 'The price cannot be negative'
        }
    },
    thumbnail: {
        type: String,
        required: true
    },
    code: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    stock: {
        type: Number,
        required: true,
        validate: {
            validator: function(value) {
                return value >= 0;
            },
            message: 'The stock cannot be negative'
        }
    },
})
productSchema.plugin(mongoosePaginate)
export const productModel = mongoose.model(productCollection,productSchema)