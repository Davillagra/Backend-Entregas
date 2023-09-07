import express from "express"
import productsRouter from "./routes/product.js"
import cartsRouter from "./routes/cart.js"
import handlebars from "express-handlebars"
import __dirname from "./utils.js"
import { Server } from "socket.io"
import ProductManager from "./dao/ProductManager.js"
import mongoose from "mongoose"
import localProductsRouter from "./routes/productLocal.js"
import localCartsRouter from "./routes/cartLocal.js"
import chatRouter from "./routes/chat.js"
import ChatManager from "./dao/ChatManager.js"

const productos = new ProductManager()

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.engine(`handlebars`, handlebars.engine())
app.set(`views`,__dirname + `/views`)
app.set(`view engine`,`handlebars`)
app.use(express.static(__dirname + `/public`))

app.get("/",(req,res) => {
    res.send("Servidor en linea")
})

app.use("/api/products",productsRouter)
app.use("/api/cart",cartsRouter)
app.use("/api/productsLocal",localProductsRouter)
app.use("/api/cartLocal",localCartsRouter)
app.use("/api/chat",chatRouter)


mongoose.connect(`mongodb+srv://Zorkanoid:uEBaZmoUJldNKnBP@cluster0.etq8mtb.mongodb.net/Ecomerce`)

const server = app.listen(8080,()=>{console.log(`Servidor en linea en el puerto 8080`)})
const io = new Server(server)
io.on(`connection`, async socket =>{
    console.log("Nuevo socket conectado")
    socket.on('form', async (formData) => {
        await productos.updateProduct(formData._id, formData)
        const data = await productos.getProducts()
        io.emit("change",{data})
    })

    const chats = new ChatManager()
    const messages = await chats.getMessages()
    socket.emit(`messageLogs`,messages)
    socket.on(`message`, async data=>{
        const dsadas = await chats.pushMessage(data)
        const newMessages = await chats.getMessages()
        console.log(dsadas)
        io.emit(`messageLogs`,newMessages)
    })
})

export {io}