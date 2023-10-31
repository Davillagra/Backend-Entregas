import mongoose from "mongoose"
const ticketCollection = `tickets`
import { v4 as uuidv4 } from 'uuid'
import validator from 'validator'

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        default: uuidv4,
      },
    purchase_datetime:{
        type: Date,
        default: Date.now 
    },
    amount: {
        type:Number
    },
    purchaser: {
        type: String,
        required: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: 'El campo "user" debe ser una dirección de correo electrónico válida.'
        }
    }
})

export const ticketModel = mongoose.model(ticketCollection,ticketSchema)