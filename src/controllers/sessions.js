import { options } from "../config/options.js"

export const login = async (req, res) => {
  if(!req.user) return res.status(400).send({status:"error",error:"Invalid credentials"})
  req.session.user = {
    name: `${req.user.first_name} ${req.user.last_name}`,
    email: req.user.email,
    age: req.user.age,
    role: req.user.role,
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
  console.log("Failed strategy")
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
  let {first_name,last_name,age,email,cart} =  req.user
  res.send({session:{first_name,last_name,age,email,cart}})
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