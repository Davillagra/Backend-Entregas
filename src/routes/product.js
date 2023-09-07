import { Router } from "express";
import ProductManager from "../dao/ProductManager.js"
import {io} from "../index.js"

const router = Router()
const productos = new ProductManager()

router.get("/", async (req,res)=>{
    const limit = req.query.limit
    const products = await productos.getProducts(limit)
    res.send(products)
})
router.get("/realtimeProducts", async (req,res) => {
    const productsa = await productos.getProducts()
    const products  = []
    productsa.forEach(e => {
        products.push({_id:e._id,title:e.title,description:e.description,price:e.price,thumbnail:e.thumbnail,code:e.code,stock:e.stock})
    })
    res.render(`realtimeProducts`,{products})
})
router.get("/:id", async (req,res)=> {
    const productID = req.params.id
    const product = await productos.getProductById(productID)
    if(!product.message){
        res.send({status:"succes",message:product})
    } else {
        res.status(404).send({status:"error",message:"Product not found"})
    }
})

router.post("/", async (req,res)=>{
    const products = req.body
    const addProduct = await productos.addProduct(products)
    if(!addProduct.message){
        const data = await productos.getProducts()
        io.emit("change", {data})
        res.status(201).send({status:"succes",message:addProduct})
    } else {
        res.status(404).send({status:"error",message:addProduct.message})
    }
})

router.put(`/:id`, async (req,res)=>{
    let prodcutID = req.params.id
    let product = req.body
    const updateProduct = await productos.updateProduct(prodcutID, product)
    if(!updateProduct.message){
        const data = await productos.getProducts()
        io.emit("change", {data})
        res.send({status:"succes",message:updateProduct})
    } else {
        res.status(400).send({status:"error",message:updateProduct.message})
    } 
})

router.delete(`/:id`, async (req,res)=>{
    const productID = req.params.id
    const deleteProduct = await productos.deleteProduct(productID)
    if(!deleteProduct.message){
        const data = await productos.getProducts()
        io.emit("change", {data})
        res.send({status:"success",message:deleteProduct})
    } else {
        res.status(404).send({status:"error",message:deleteProduct.message})
    }
})

export default router