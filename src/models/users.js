import mongoose from "mongoose"
import validator from 'validator'

const userCollection = `users`

const documentSchema = new mongoose.Schema({
    name: String,
    reference: String,
})

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique:true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: 'Must be a valid email'
        }
    },
    password: String,
    role: {
        type: String,
        enum: ['admin', 'user','premium'],
        default: 'user'
    },
    age: Number,
    userName: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"carts"
    },
    documents: [
        documentSchema,
    ],
    last_connection: {
        type: Date,
    }
})

userSchema.pre("findOne", function () {
    this.populate("cart")
})

export const usersModel = mongoose.model(userCollection,userSchema)