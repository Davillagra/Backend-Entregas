
import {productMethod} from "../dao/factory.js"
import {io} from "../index.js"

export const getProducts = async (req,res)=>{
    const limit = req.query.limit
    const page = req.query.page
    const query = req.query.query
    const sort = req.query.sort
    const products = await productMethod.getProds(limit,page,sort,query)
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
}

export const getProductById = async (req,res)=> {
    const productID = req.params.id
    const product = await productMethod.getProductById(productID)
    if(product){
        res.send({status:"succes",message:product})
    } else {
        res.status(404).send({status:"error",message:"Product not found"})
    }
}

export const postProduct = async (req,res)=>{
    const products = req.body
    const addProduct = await productMethod.addProduct(products)
    if(!addProduct.message){
        const data = await productMethod.getProds()
        io.emit("change", {data})
        res.status(201).send({status:"succes",message:addProduct})
    } else {
        res.status(404).send({status:"error",message:addProduct.message})
    }
}

export const updateProduct = async (req,res)=>{
    let prodcutID = req.params.id
    let product = req.body
    const updateProd = await productMethod.updateProduct(prodcutID, product)
    if(updateProd.matchedCount == 0){
        res.status(404).send({status:"error",message:"Product not found"})
    } else {
        if(updateProd.message){
            res.status(400).send({status:"error",message:updateProd.message})
        } else {
            const data = await productMethod.getProds()
            io.emit("change", {data})
            res.send({status:"succes",message:"Product updated",info:updateProd})
        }
    } 
}

export const deleteProduct = async (req,res)=>{
    const productID = req.params.id
    const deleteProduct = await productMethod.deleteProduct(productID)
    if(!deleteProduct.message){
        const data = await productMethod.getProds()
        io.emit("change", {data})
        res.send({status:"success",message:deleteProduct})
    } else {
        res.status(404).send({status:"error",message:deleteProduct.message})
    }
}