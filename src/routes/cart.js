import { Router } from "express"
import { getCart, postNewCart, purchase, pushProducts, putProducts, removeCart, removeProduct, removeProducts, upateQuantity } from "../controllers/cart.js"
import { verifyToken, verifyTokenAdmin,verifyTokenPremium } from "../controllers/jwt.js"

const router = Router()

router.post("/",verifyToken, postNewCart)
router.get("/:cid", getCart)
router.post("/:cid/product/:pid",verifyToken, pushProducts)
router.delete(`/:cid/product/:pid`,verifyToken, removeProduct)
router.delete(`/:cid`, removeCart) // hacé esto bien porfa
router.put("/:cid",verifyToken, putProducts)
router.put("/:cid/product/:pid",verifyToken, upateQuantity)
router.delete(`/:cid/products`,verifyToken, removeProducts)
router.put(`/:cid/purchase`,verifyToken, purchase)

export default router
