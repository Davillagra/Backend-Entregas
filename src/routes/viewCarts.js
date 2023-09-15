import { Router } from "express"
import {io} from "../index.js"
import CartManager from "../dao/CartManager.js"

const router = Router()
const carts = new CartManager()

router.get("/:cid", async (req,res) => {
    const cid = req.params.cid
    const cart = await carts.getCartById(cid)
    let products = []
    cart.products.forEach(p => {
        products.push({title:p.product.title,description:p.product.description,price:p.product.price,thumbnail:p.product.thumbnail,code:p.product.code,stock:p.product.stock,quantity:p.quantity})
    })
    res.render(`carts`,{products})
})
export default router