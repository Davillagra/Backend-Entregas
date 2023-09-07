import { Router } from "express";
import CartManager from "../dao/CartManager.js"

const router = Router()
const carrito = new CartManager()

router.post("/", async (req,res)=>{
    const getNewCart = await carrito.getNewCart()
    if(!getNewCart.message){
        return res.status(201).send({status:"success",message:getNewCart})
    } else {
        return res.status(400).send({status:"error",message:getNewCart.message})
    }
    
})
router.get("/:cid", async (req,res)=>{
    const cid = req.params.cid
    const getCartById = await carrito.getCartById(cid)
    if(getCartById){
        return res.send({status:"success",message:getCartById})
    } else {
        return res.status(404).send({status:"error",message:"Cart not found"})
    }
})
router.post("/:cid/product/:pid", async (req,res)=>{
    const cid = req.params.cid
    const pid = req.params.pid
    const pushProducts = await carrito.pushProducts(cid,pid)
    if(!pushProducts){
        res.status(404).send({status:"error",message:"Cart not found"}) 
    } else {
        if(!pushProducts.message){
            res.status(201).send({status:"success",message:`Product added`})
        } else {
            res.status(404).send({status:"error",message:pushProducts.message}) 
        }    
    } 
})
router.delete(`/:id`, async (req,res)=>{
    const cartID = req.params.id
    const deleteCart = await carrito.deleteCart(cartID)
    if(deleteCart.deletedCount == 1){
        res.send({status:`success`,message:"Deleted cart"})
    } else {
        res.status(404).send({status: `error`,message:"No carts found"})
    }
})

export default router