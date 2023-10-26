import { messagesModel } from "../../models/messages.js"
import { connect } from "../../config/conection.js"

const conection = connect

class ChatManager {
    constructor() {}
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