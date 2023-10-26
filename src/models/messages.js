import mongoose from "mongoose"
import validator from 'validator'
const messageCollection = `messages`


const messageSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: 'El campo "user" debe ser una dirección de correo electrónico válida.'
        }
    },
    message:{
        type: String,
        default: 1
    },
    createAt: {
        type: Date,
        default: Date.now 
    },
    userName: {
        type: String,
    }
})

export const messagesModel = mongoose.model(messageCollection,messageSchema)