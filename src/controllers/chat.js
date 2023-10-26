import ChatManager from "../dao/mongo/ChatManager.js"

const chats = new ChatManager()

export const chat =  async (req,res) =>{
    const data = await chats.getMessages()
    const messages  = []
    data.forEach(e => {
        messages.push({_id:e._id,user:e.user,message:e.message})
    })
    res.render(`chat`,{messages})
}