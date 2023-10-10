import { Router } from "express"
import passport from "passport"
import { usersModel } from "../models/users.js"

const router = Router()

const adminLogin = (req, res, next) => {
  const { email, password } = req.body
  if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    req.session.user = {
      name: `Admin`,
      email: "adminCoder@coder.com",
      role: "admin",
    }
  return res.send({ status: "success", payload: req.session.user })
  }
  next()
}

router.post("/login", adminLogin,passport.authenticate("login", {failureRedirect: "/api/sessions/faillogin",}),async (req, res) => {
  if(!req.user) return res.status(400).send({status:"error",error:"Invalid credentials"})
  req.session.user = {
    name: `${req.user.first_name} ${req.user.last_name}`,
    email: req.user.email,
    age: req.user.age,
    role: req.user.role,
  }
  return res.send({ status: "success", payload: req.session.user })
  }
)
router.get("/faillogin", (req, res) => {
  res.send({ status: "error", error:"Failed login"})
})

router.post("/signup",passport.authenticate("signup", {failureRedirect: "/api/sessions/failSignup",}),
  async (req, res) => {
    res.send({ status: "success", message: "Usuario registrado" })
  }
)

router.get("/failSignup", async (req, res) => {
  console.log("Failed strategy")
  res.send({ error: "Failed" })
})

router.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) return res.send({ error })
    res.redirect("/login")
  })
})

router.get('/github', passport.authenticate('github', {scope: ['user:email']}) ,async (req, res) => {})

router.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/login'}) ,async (req, res) => {
  req.session.user = req.user
  res.redirect('/profile')
})

router.get("/current", async (req, res) => {
  let {first_name,last_name,age,email,cart} =  req.user
  res.send({session:{first_name,last_name,age,email,cart}})
})


export default router
