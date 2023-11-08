import { Router } from "express"
import { mockingProdcuts } from "../controllers/mockingProdcuts.js"

const router = Router()


router.get("/", mockingProdcuts )

export default router
