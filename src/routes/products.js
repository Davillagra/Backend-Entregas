import { Router } from "express";
import ProductManager from "../../ProductManager.js"
import io from "../index.js"

const router = Router()
const productos = new ProductManager()
const getProducts = await productos.getProducts()

router.get("/",(req,res) => {
    let limit = req.query.limit
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
    res.render(`realTimeProducts`,{consulta})
})

router.get("/realtime/products",(req,res)=>{
    let limit = req.query.limit
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

router.get("/:id",(req,res)=> {
    const productID = +req.params.id
    let product = getProducts.find(p => p.id === productID)
    if (product !== undefined) {
        res.send(product)
    } else {
        let error = { error:"Lo sentimos, el id que buscaba no se encontró" }
        res.send(error)
    }
})

router.post("/", async (req,res)=>{
    const product = req.body
    if (!product.title || !product.description || !product.price || !product.code || !product.stock){
        return res.status(400).send({status: `error`,error:`Valores incompletos`})
    }
    const addProduct = await productos.addProduct({...product,status:true})
    const data = await productos.getProducts()
    io.emit("change", {data})
    return res.send({status: `success`,message:addProduct})
})

router.put(`/:id`, async (req,res)=>{
    let prodcutID = +req.params.id
    let product = req.body
    const index = getProducts.findIndex((p)=>p.id===prodcutID)
    if(index === -1){
        return res.status(404).send({status: `error`,error:`No se encontró el id`})
    } else {
        if(!product.code){
            const updateProduct = await productos.updateProduct(prodcutID, product)
            const data = await productos.getProducts()
            io.emit("change", {data})
            res.send({status: `success`,message:updateProduct})
        } else {
            res.status(404).send({status: `error`,error:`No se puede modificar el Codigo del producto.`})
        }
        
    }
})

router.delete(`/:id`, async (req,res)=>{
    const productID = +req.params.id
    const deleteProduct = await productos.deleteProduct(productID)
    if(deleteProduct === `El producto de id: ${productID} no existe`){
        return res.status(404).send({status: `error`,error:deleteProduct})
    }
    const data = await productos.getProducts()
    io.emit("change", {data})
    res.send({status: `success`,message:deleteProduct})
})

export default router