import express from "express"
import productsRouter from "./routes/products.js"
import cartsRouter from "./routes/cart.js"

const productsManager = async () => {
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get("/",(req,res) => {
    res.send("Servidor en linea")
})

app.use("/api/products",productsRouter)
app.use("/api/cart",cartsRouter)

app.listen(8080,()=>{
    console.log("Servidor en linea")
})
}

productsManager()

