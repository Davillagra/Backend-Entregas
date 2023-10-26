import { Router } from "express"
import { chat } from "../controllers/chat.js"
import { userAccess } from "../controllers/views.js"

const router = Router()

router.get("/",userAccess, chat)

export default router