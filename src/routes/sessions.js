import { Router } from "express"
import passport from "passport"
import { adminLogin, current, failSignup, faillogin, github, githubcallback, login, logout, recover, restore, signup, updateSession } from "../controllers/sessions.js"


const router = Router()

router.post("/login", adminLogin,passport.authenticate("login", {failureRedirect: "/api/sessions/faillogin",}), login)

router.get("/faillogin", faillogin)

router.post("/signup",passport.authenticate("signup", {failureRedirect: "/api/sessions/failSignup",}), signup)

router.get("/failSignup", failSignup)

router.post("/logout", logout)

router.get('/github', passport.authenticate('github', {scope: ['user:email']}) , github)

router.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/login'}) , githubcallback)

router.get("/current", current)

router.get("/updateSession", updateSession)

router.post("/recover", recover)

router.post("/restore", restore)



export default router
