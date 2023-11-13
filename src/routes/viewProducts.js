import { Router } from "express"
import { adminProducts, userProducts } from "../controllers/viewProducts.js"
import { adminAccess, privateAccess, publicAccess } from "../controllers/views.js"

const router = Router()

router.get("/",publicAccess, userProducts)
router.get("/admin",privateAccess,adminAccess,adminProducts)

export default router