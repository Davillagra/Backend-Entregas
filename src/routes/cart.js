import { Router } from "express"
import { getCart, postNewCart, pushProducts, putProducts, removeCart, removeProduct, removeProducts, upateQuantity } from "../controllers/cart.js"

const router = Router()

router.post("/", postNewCart)
router.get("/:cid", getCart)
router.post("/:cid/product/:pid", pushProducts)
router.delete(`/:cid/product/:pid`, removeProduct)
router.delete(`/:id`, removeCart)
router.put("/:cid", putProducts)
router.put("/:cid/products/:pid", upateQuantity)
router.delete(`/:cid/products`, removeProducts)

export default router
