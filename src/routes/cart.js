import { Router } from "express";
import CartManager from "../../CartManager.js"
import ProductManager from "../../ProductManager.js";

const router = Router()
const carrito = new CartManager()
const productos = new ProductManager()


router.post("/", async (req,res)=>{
    const getNewCart = await carrito.getNewCart()
    return res.send({status: `success`,message:getNewCart})
})
router.get("/:cid", async (req,res)=>{
    const cid = +req.params.cid
    const getCartById = await carrito.getCartById(cid)
    return res.send({status: `success`,message:getCartById})
})
router.post("/:cid/product/:pid", async (req,res)=>{
    const cid = +req.params.cid
    const pid = +req.params.pid
    const getCartById = await carrito.getCartById(cid)
    if(getCartById===`El carrito de id ${cid} no existe`){
        return res.send({status: `success`,message:getCartById})
    }
    const getProductById = await productos.getProductById(pid)
    if(getCartById===`El producto de id ${pid} no existe`){
        return res.send({status: `success`,message:getProductById})
    }
    const pushProducts = await carrito.pushProducts(cid,pid)
    return res.send({status: `success`,message:pushProducts})
})

export default router