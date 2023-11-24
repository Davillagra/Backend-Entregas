import jwt from "jsonwebtoken"
import { options } from "../config/options.js"

export const publicAccess = (req, res, next) => {
  next()
}

export const privateAccess = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login")
  }
  next()
}

export const adminAccess = (req, res, next) => {
  if (req.session.user.role === "admin") {
    next()
  } else {
    req.logger.info("Admin endpoint")
    return res.redirect("/products")
  }
}
export const userAccess = (req, res, next) => {
  if (req.session.user.role === "user") {
    next()
  } else {
    req.logger.info("User-only endpoint")
    return res.redirect("/profile")
  }
}

export const login = (req, res) => {
  res.render("login")
}

export const signup = (req, res) => {
  res.render("signup")
}

export const profile = (req, res) => {
  res.render("profile", {
    user: req.session.user,
  })
}

export const recover = (req, res) => {
  res.render("recover")
}

export const recoverPass = async (req, res) => {
  const token = req.query.token
  try {
    const decodedToken = jwt.verify(token, options.token)
    if (decodedToken.purpose === "reset-password") {
      res.render("resetpassword")
    } else {
      res.send("El propósito del token no es válido.")
    }
  } catch (error) {
    res.render("recover")
  }
}
