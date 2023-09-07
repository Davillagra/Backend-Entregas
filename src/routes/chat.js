import { Router } from "express"
import { io } from "../index.js"
import ChatManager from "../dao/ChatManager.js"

const chats = new ChatManager()
const router = Router()

router.get("/", async (req,res) =>{
    const data = await chats.getMessages()
    const messages  = []
    data.forEach(e => {
        messages.push({_id:e._id,user:e.user,message:e.message})
    })
    res.render(`chat`,{messages})
})

/*io.on(`connection`, socket =>{
    socket.on(`message`, async data=>{
        await chats.pushMessage(data.user,data.message)
        const messages = await chats.getMessages()
        io.emit(`messageLogs`,messages)
    })
})*/


export default router