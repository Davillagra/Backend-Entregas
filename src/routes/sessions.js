import { Router } from "express"
import { usersModel } from "../models/users.js"

const router = Router()

router.post("/login", async (req, res)=>{
  const { email, password } = req.body
  const user = await usersModel.findOne({ email, password })
  if(email === "adminCoder@coder.com" && password === "adminCod3r123"){
    req.session.user = {
        name: `Admin`,
        email: "adminCoder@coder.com",
        role: "admin"
      }
    return res.send({ status: "success", payload: req.session.user })
  }
  if (!user) {
    return res.status(400).send({ status: "error", error: "Invalid credencials" })
  } else {
     req.session.user = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      role: user.role
    }
    return res.send({ status: "success", payload: req.session.user })
  }
})

router.post("/signup", async (req,res)=>{
    const data = req.body
    const user = await usersModel.findOne({email:data.email})
    if(user){
        return res.status(400).send({ status: "error", error: "Email already exists" })
    } else {
        try {
            const newUser = await usersModel.create(data)
            return res.status(200).send({status: "succes",payload:"New user created"})
        } catch (error) {
            return res.status(400).send({status: "error",error:error.message})
        }
    }
} )

router.post("/logout",(req,res)=>{
    req.session.destroy(error=>{
        if(error) return res.send({error})
        res.redirect("/login")
    })
})


export default router;
