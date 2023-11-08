import nodemailer from "nodemailer"
import { options } from "./options.js"

export const transport = nodemailer.createTransport({
    service:`gmail`,
    port:587,
    auth:{
        user:options.transport.mail,
        pass:options.transport.pass
    }
})