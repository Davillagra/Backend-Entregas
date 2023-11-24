import { Router } from "express"
import { switchRole } from "../controllers/users.js"
import { verifyTokenAdmin } from "../controllers/jwt.js"

const router = Router()

router.get("/:uid",verifyTokenAdmin,switchRole)

export default router