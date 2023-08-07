const express = require("express")
const ProductManager = require("./ProductManager");

const productos = new ProductManager()

const productsManager = async () => {

const getProducts = await productos.getProducts()
//const addProduct = await productos.addProduct(data)
//console.log(addProduct)
//const getProductById = await productos.getProductById(1)
//console.log(getProductById)
//const updateProduct = await productos.updateProduct(5,updateData)
//console.log(updateProduct)
//const deleteProduct = await productos.deleteProduct(1)
//console.log(deleteProduct)
const app = express()

app.use(express.urlencoded({extended: true}))

app.get("/",(req,res) => {
    res.send("Servidor en linea")
})

app.get("/products",(req,res) => {
    limit = req.query.limit
    const consulta = []
    if (limit > 0 && limit) {
        if (limit > getProducts.length) {
            limit = getProducts.length
        }
        for (i = 0; i < limit; i++) {
        consulta.push(getProducts[i])
        }
    } else {
        consulta.push(...getProducts)
    }
    res.send(consulta)
})

app.get("/products/:id",(req,res)=> {
    const idUser = +req.params.id
    let user = getProducts.find(e => e.id === idUser)
    if (user !== undefined) {
        res.send(user)
    } else {
        let error = { error:"Lo sentimos, el id que buscaba no se encontró" }
        res.send(error)
    }
    
})

app.listen(8080,()=>{
    console.log("Servidor en linea")
})
}

productsManager()

