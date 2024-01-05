import { Router } from "express"
import {verifyTokenAdmin} from "../controllers/jwt.js"
import { getUsersAdmin } from "../controllers/adminView.js"

const router = Router()

router.get("/", verifyTokenAdmin, getUsersAdmin)

export default router