import { Router } from "express"
import { chat } from "../controllers/chat.js"
import { privateAccess, userAccess } from "../controllers/views.js"

const router = Router()

router.get("/",privateAccess,userAccess, chat)

export default router