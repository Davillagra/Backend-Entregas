import { Router } from "express"
import { adminProducts, userProducts } from "../controllers/viewProducts.js"

const router = Router()

router.get("/", userProducts)

router.get("/admin", adminProducts)

export default router