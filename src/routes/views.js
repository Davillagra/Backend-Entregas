import { Router } from "express"
import { login, privateAccess, profile, publicAccess, recover, recoverPass, signup } from "../controllers/views.js"

const router = Router()

router.get("/login",publicAccess, login)

router.get("/",publicAccess, login) // temporal

router.get("/signup",publicAccess, signup)

router.get("/profile",privateAccess, profile)

router.get("/recover",publicAccess, recover)

router.get("/recoverpass", recoverPass)



export default router