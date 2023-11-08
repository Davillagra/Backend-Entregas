import { options } from "../config/options.js"

export const login = async (req, res) => {
  if(!req.user) return res.status(400).send({status:"error",error:"Invalid credentials"})
  req.session.user = {
    name: `${req.user.first_name} ${req.user.last_name}`,
    email: req.user.email,
    age: req.user.age,
    role: req.user.role,
    _id: req.user._id,
    cart: req.user.cart ?? null
  }
  return res.send({ status: "success", payload: req.session.user })
}

export const faillogin = (req, res) => {
  res.send({ status: "error", error:"Failed login"})
}

export const signup = async (req, res) => {
    res.send({ status: "success", message: "Usuario registrado" })
}

export const failSignup = async (req, res) => {
  res.send({ error: "Failed" })
}

export const logout = (req, res) => {
  req.session.destroy((error) => {
    if (error) return res.send({ error })
    res.redirect("/login")
  })
}

export const github = async (req, res) => {}

export const githubcallback = async (req, res) => {
  req.session.user = req.user
  res.redirect('/profile')
}

export const current = async (req, res) => {
  if(req.user){
    let {first_name,last_name,age,email,cart} =  req.user
    res.send({session:{first_name,last_name,age,email,cart}})
  } else {
    res.status(401).send({status:"error",message:"Must login firts"})
  }
}

export const updateSession = async (req,res)=> {
  console.log(req.user,req.session.user)
  if(req.user){
    req.session.user = req.user
    res.send({status:"success",message:"User updated",data:req.session.user})
  } else {
    res.status(401).send({status:"error",message:"Cannot update"})
  }
}

export const adminLogin = (req, res, next) => {
  const { email, password } = req.body
  if (email === options.user.adminEmail && password === options.user.adminPass) {
    req.session.user = {
      name: `Admin`,
      email: options.user.adminEmail,
      role: "admin",
    }
  return res.send({ status: "success", payload: req.session.user })
  }
  next()
}