import { Router } from "express"
import { deleteUser, switchRole } from "../controllers/users.js"
import { verifyTokenAdmin } from "../controllers/jwt.js"

const router = Router()

router.get("/premium/:uid",verifyTokenAdmin, switchRole)
router.delete("/delete/:id",verifyTokenAdmin, deleteUser)

export default router