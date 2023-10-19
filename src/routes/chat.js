import { Router } from "express"
import { chat } from "../controllers/chat.js"

const router = Router()

router.get("/", chat)

export default router