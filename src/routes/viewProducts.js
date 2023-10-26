import { Router } from "express"
import { adminProducts, userProducts } from "../controllers/viewProducts.js"
import { adminAccess } from "../controllers/views.js"

const router = Router()

router.get("/", userProducts)
router.get("/admin",adminAccess, adminProducts)

export default router