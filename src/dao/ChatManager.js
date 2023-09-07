import { messagesModel } from "../models/messages.js"
import { connect } from "./conection.js"

const conection = connect

class ChatManager {
    constructor() {}
    /*createUser = async (name) => {
        try {
            const data = await messagesModel.create({userName:name})
            return data._id
        } catch (error) {
            return error
        }
    }*/
    getMessages = async (limit=-10) => {
        const messages = await messagesModel.find()
        const lastMessages = messages.slice(limit)
        return lastMessages
    }
    pushMessage = async (message) => {
        try {
            const data = await messagesModel.create(message)
            return data
        } catch (error) {
            return error
        }
    }
}

export default ChatManager