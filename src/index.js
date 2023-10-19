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
import viewProductsRouter from "./routes/viewProducts.js"
import viewCartsRouter from "./routes/viewCarts.js"
import ChatManager from "./dao/ChatManager.js"
import viewRouter  from "./routes/views.js"
import sessionRouter from "./routes/sessions.js"
import session from 'express-session'
import MongoStore from "connect-mongo"
import passport from "passport"
import initializePassport from "./config/passport.js"
import { options } from "./config/options.js"

const productos = new ProductManager()

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.engine(`handlebars`, handlebars.engine())
app.set(`views`,__dirname + `/views`)
app.set(`view engine`,`handlebars`)
app.use(express.static(__dirname + `/public`))

mongoose.connect(options.mongoDB.url,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

app.use(session({
    store: MongoStore.create({
        mongoUrl: options.mongoDB.url,
        ttl: 3600
    }),
    secret: options.server.secretSession,
    resave: false,
    saveUninitialized: false
}))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use("/api/products",productsRouter)
app.use("/api/cart",cartsRouter)
app.use("/api/productsLocal",localProductsRouter)
app.use("/api/cartLocal",localCartsRouter)
app.use("/api/chat",chatRouter)
app.use("/products",viewProductsRouter)
app.use("/carts",viewCartsRouter)
app.use(viewRouter)
app.use("/api/sessions",sessionRouter)


const server = app.listen(8080,()=>{console.log(`Servidor en linea en el puerto 8080`)})
const io = new Server(server)
io.on(`connection`, async socket =>{
    console.log("Nuevo socket conectado")
    socket.on('form', async (formData) => {
        await productos.updateProduct(formData._id, formData)
        const data = await productos.getProds()
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