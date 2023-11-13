import { Router } from "express"
import { getCart } from "../controllers/viewCarts.js"
import { privateAccess } from "../controllers/views.js"

const router = Router()

router.get("/:cid",privateAccess, getCart)

export default router