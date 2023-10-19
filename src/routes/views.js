import { Router } from "express"
import { login, privateAccess, profile, publicAccess, signup } from "../controllers/views.js"

const router = Router()

router.get("/login",publicAccess, login)

router.get("/signup",publicAccess, signup)

router.get("/profile",privateAccess, profile)

export default router