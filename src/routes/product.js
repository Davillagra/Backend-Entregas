import { Router } from "express";
import ProductManager from "../dao/ProductManager.js"
import {io} from "../index.js"

const router = Router()
const productos = new ProductManager()

router.get("/", async (req,res)=>{
    const limit = req.query.limit || 10
    const page = req.query.page || 1
    const query = req.query.query
    const sort = req.query.sort || ""
    const products = await productos.getProducts(limit,page,sort,query)
    res.send({
        status:"succes",
        payload:products.docs,
        totalPages:products.totalPages,
        prevPage:products.prevPage,
        nextPage:products.nextPage,
        hasPrevPage:products.hasPrevPage,
        hasNextPage:products.hasNextPage,
        prevLink: products.prevPage ? `/api/products/realtimeproducts?page=${products.prevPage}&limit=${limit}&query=${query}&sort=${sort}` : null ,
        nextLink: products.nextPage ? `/api/products/realtimeproducts?page=${products.nextPage}&limit=${limit}&query=${query}&sort=${sort}` : null ,
    })
})
router.get("/realtimeProducts", async (req,res) => {
    const limit = req.query.limit || 10
    const page = req.query.page || 1
    const query = req.query.query
    const sort = req.query.sort || ""
    const productsa = await productos.getProducts(limit,page,sort,query)
    const products  = []
    productsa.docs.forEach(e => {
        products.push({_id:e._id,title:e.title,description:e.description,price:e.price,thumbnail:e.thumbnail,code:e.code,stock:e.stock,category:e.category})
    })
    res.render(`realtimeProducts`,{products,hasNextPage:productsa.hasNextPage,hasPrevPage:productsa.hasPrevPage,nextPage:productsa.nextPage,prevPage:productsa.prevPage})
})
router.get("/:id", async (req,res)=> {
    const productID = req.params.id
    const product = await productos.getProductById(productID)
    if(product){
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
    console.log(updateProduct)
    if(updateProduct.matchedCount == 0){
        res.status(404).send({status:"error",message:"Product not found"})
    } else {
        if(updateProduct.message){
            res.status(400).send({status:"error",message:updateProduct.message})
        } else {
            const data = await productos.getProducts()
            io.emit("change", {data})
            res.send({status:"succes",message:"Product updated",info:updateProduct})
        }
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