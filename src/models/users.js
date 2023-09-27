import mongoose from "mongoose"
import validator from 'validator'
const userCollection = `users`


const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: 'Must be a valid email'
        }
    },
    password: String,
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    age: Number,
    userName: String
})

export const usersModel = mongoose.model(userCollection,userSchema)