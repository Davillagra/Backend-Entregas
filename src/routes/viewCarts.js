import { Router } from "express"
import { getCart } from "../controllers/viewCarts.js"

const router = Router()

router.get("/:cid", getCart)

export default router