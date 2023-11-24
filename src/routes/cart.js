import { Router } from "express"
import { getCart, postNewCart, purchase, pushProducts, putProducts, removeCart, removeProduct, removeProducts, upateQuantity } from "../controllers/cart.js"
import { verifyToken, verifyTokenAdmin,verifyTokenPremium } from "../controllers/jwt.js"

const router = Router()

router.post("/",verifyToken, postNewCart)
router.get("/:cid", getCart)
router.post("/:cid/product/:pid",verifyToken, pushProducts)
router.delete(`/:cid/product/:pid`, removeProduct)
router.delete(`/:id`, removeCart)
router.put("/:cid",verifyToken, putProducts)
router.put("/:cid/products/:pid", upateQuantity)
router.delete(`/:cid/products`, removeProducts)
router.put(`/:cid/purchase`, purchase)

export default router
