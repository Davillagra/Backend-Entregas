import express from "express"
import productsRouter from "./routes/product.js"
import cartsRouter from "./routes/cart.js"
import handlebars from "express-handlebars"
import __dirname, { addLogger } from "./utils.js"
import { Server } from "socket.io"
import mongoose from "mongoose"
import chatRouter from "./routes/chat.js"
import viewProductsRouter from "./routes/viewProducts.js"
import viewCartsRouter from "./routes/viewCarts.js"
import ChatManager from "./dao/mongo/ChatManager.js"
import viewRouter  from "./routes/views.js"
import sessionRouter from "./routes/sessions.js"
import session from 'express-session'
import MongoStore from "connect-mongo"
import passport from "passport"
import initializePassport from "./config/passport.js"
import { options } from "./config/options.js"
import { productMethod } from "./dao/factory.js"
import mockingRouter from "./routes/mockingProducts.js"
import loggerTestRouter from "./routes/loggerTest.js"

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.engine(`handlebars`, handlebars.engine())
app.set(`views`,__dirname + `/views`)
app.set(`view engine`,`handlebars`)
app.use(express.static(__dirname + `/public`))
app.use(addLogger)

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
app.use('/public', express.static('public'));
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use("/api/products",productsRouter)
app.use("/api/cart",cartsRouter)
app.use("/api/chat",chatRouter)
app.use("/products",viewProductsRouter)
app.use("/carts",viewCartsRouter)
app.use(viewRouter)
app.use("/api/sessions",sessionRouter)
app.use("/mockingproducts",mockingRouter)
app.use("/loggertest",loggerTestRouter)

const server = app.listen(8080,()=>{console.log(`Servidor en linea en el puerto 8080`)})
const io = new Server(server)
io.on(`connection`, async socket =>{
    console.log("Nuevo socket conectado")
    socket.on('form', async (formData) => {
        await productMethod.updateProduct(formData._id, formData)
        const data = await productMethod.getProds()
        io.emit("change",{data})
    })
    const chats = new ChatManager()
    const messages = await chats.getMessages()
    socket.emit(`messageLogs`,messages)
    socket.on(`message`, async data =>{
        const dsadas = await chats.pushMessage(data)
        let userName = data.userName
        const newMessages = await chats.getMessages()
        newMessages.userName = userName
        io.emit(`messageLogs`,newMessages)
    })
    socket.on(`buy`, async data => {
        console.log(data)
    })
})

export {io}