import { Router } from "express"
import { getCart, postNewCart, purchase, pushProducts, putProducts, removeCart, removeProduct, removeProducts, upateQuantity } from "../controllers/cart.js"

const router = Router()

router.post("/", postNewCart)
router.get("/:cid", getCart)
router.post("/:cid/product/:pid", pushProducts)
router.delete(`/:cid/product/:pid`, removeProduct)
router.delete(`/:id`, removeCart)
router.put("/:cid", putProducts)
router.put("/:cid/products/:pid", upateQuantity)
router.delete(`/:cid/products`, removeProducts)
router.put(`/:cid/purchase`, purchase)

export default router
