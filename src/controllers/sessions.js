import { transport } from "../config/trasnport.js"
import { options } from "../config/options.js"
import jwt from "jsonwebtoken"
import { createHash, isValidPassword } from "../utils.js"
import { usersModel } from "../models/users.js"

export const login = async (req, res) => {
  if (!req.user) {
    req.logger.info("Invalid credentials")
    return res.status(400).send({ status: "error", error: "Invalid credentials" })
  }
  req.session.user = {
    name: `${req.user.first_name} ${req.user.last_name}`,
    email: req.user.email,
    age: req.user.age,
    role: req.user.role,
    _id: req.user._id,
    cart: req.user.cart ?? null,
  }
  await usersModel.findByIdAndUpdate(req.session.user._id,{last_connection: Date.now()})
  let token
  if(req.user.role === "premium"){
    token = jwt.sign({ email:req.session.user.email, purpose: 'login' }, options.tokenPremium, { expiresIn: '1h' })
  } else {
    token = jwt.sign({ email:req.session.user.email, purpose: 'login' }, options.token, { expiresIn: '1h' })
  }
  return res.send({ status: "success", token, payload:req.session.user })
}

export const faillogin = (req, res) => {
  req.logger.error("Failed login")
  res.send({ status: "error", message: "Failed login" })
}

export const signup = async (req, res) => {
  const {_id} = req.body
  res.send({ status: "success", message: "Usuario registrado",_id })
}

export const failSignup = async (req, res) => {
  req.logger.error("Failed signup")
  res.send({ status: "error", message: "Failed signup" })
}

export const logout = async (req, res) => {
  await usersModel.findByIdAndUpdate(req.session.user._id,{last_connection: Date.now()})
  req.session.destroy((error) => {
    if (error) {
      req.logger.error("Cannot destroy session")
      res.send({ status: "error", message: "Cannot destroy session" })
    }
    res.redirect("/login")
  })
}

export const github = async (req, res) => {}

export const githubcallback = async (req, res) => {
  req.session.user = req.user
  res.redirect("/profile")
}

export const current = async (req, res) => {
  if (req.user) {
    let { first_name, last_name, age, email, cart } = req.user
    res.send({ session: { first_name, last_name, age, email, cart } })
  } else {
    req.logger.info("Must login firts")
    res.status(401).send({ status: "error", message: "Must login firts" })
  }
}

export const updateSession = async (req, res) => {
  if (req.user) {
    req.session.user = req.user
    res.send({
      status: "success",
      message: "User updated",
      data: req.session.user,
    })
  } else {
    req.logger.error("Cannot update")
    res.status(401).send({ status: "error", message: "Cannot update" })
  }
}

export const  adminLogin = async (req, res, next) => {
  const { email, password } = req.body
  if (
    email === options.user.adminEmail &&
    password === options.user.adminPass
  ) {
    req.session.user = {
      name: `Admin`,
      email: options.user.adminEmail,
      role: "admin",
    }
    const token = jwt.sign({ email:req.session.user.email, purpose: 'login' }, options.tokenAdmin, { expiresIn: '1h' })
    return res.send({ status: "success", token, payload:req.session.user })
  }
  next()
}

export const recover = async (req, res) => {
  const { email } = req.body
  const token = jwt.sign({ email, purpose: 'reset-password' }, options.token, { expiresIn: '1h' });
  let result = transport.sendMail({
    from: `Recover pass <zorkanoid@gmail.com>`,
    to: email,
    html: `
    <div>
        <h1>Restablece tu contraseña en el siguiente link: </h1>
        <a>http://localhost:8080/recoverpass/?token=${token}&email=${email}</a>
    </div>
    `,
    attachments: [],
  })
  res.send({ status: "success"})
}

export const restore = async (req, res) => {
  const {pass,passDup,email} = req.body
  const user = await usersModel.findOne({email})
  if(pass !== passDup){
    req.logger.info("Passwords didn't match")
    return res.send({status:"error",message:"Passwords don't match"})
  }
  if(isValidPassword(user,pass)){
    req.logger.info("Password must be diferent from the previous one")
    return res.send({status:"error",message:"Password must be diferent from the previous one"})
  }
  const newHashedPassword = createHash(pass)
  const updateUser = await usersModel.updateOne({ email },{ $set: { password: newHashedPassword } })
  if(updateUser.modifiedCount!== 1){
    req.logger.info("Unexpected error while updating password")
    return res.status(400).send({status:"error",message:"Unexpected error while updating password"})
  }
  req.logger.info("Password updated succesfully")
  res.status(200).send({ status: "success", message: "Password updated successfully" })
}