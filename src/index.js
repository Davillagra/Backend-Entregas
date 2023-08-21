import express from "express"
import productsRouter from "./routes/products.js"
import cartsRouter from "./routes/cart.js"
import handlebars from "express-handlebars"
import __dirname from "./utils.js"
import { Server } from "socket.io"

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

const server = app.listen(8080,()=>{console.log(`Servidor en linea en el puerto 8080`)})
const io = new Server(server)
export default io