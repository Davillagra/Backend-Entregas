import jwt from "jsonwebtoken"
import { options } from "../config/options.js"

export const newJwt = async (req, res) => {
  const { email } = req.user
  const token = jwt.sign({ email, purpose: "login" }, options.token, {
    expiresIn: "1h",
  })
  res.send({ status: "success", token })
}

// export const verifyToken = (req, res, next) => {
//   const authHeader =
//     req.headers["authorization"] || req.headers["Authorization"]
//   if (!authHeader) {
//     return res.status(401).json({ message: "No token provided" })
//   }
//   const tokenParts = authHeader.split(" ")
//   if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
//     return res.status(401).json({ message: "Invalid token format" })
//   }
//   const token = tokenParts[1]
//   try {
//     const decodedToken = jwt.verify(token, options.token)
//     req.decodedToken = decodedToken
//     req.decodedToken.role = "user"
//     next()
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid token" })
//   }
// }

export const verifyTokenAdmin = (req, res, next) => {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"]
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" })
  }
  const tokenParts = authHeader.split(" ")
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res.status(401).json({ message: "Invalid token format" })
  }
  const token = tokenParts[1]
  try {
    const decodedToken = jwt.verify(token, options.tokenAdmin)
    req.decodedToken = decodedToken
    req.decodedToken.role = "admin"
    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" })
  }
}

export const verifyTokenPremium = (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"]
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" })
  }
  const tokenParts = authHeader.split(" ")
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res.status(401).json({ message: "Invalid token format" })
  }
  const token = tokenParts[1]
  try {
    const decodedToken = jwt.verify(token, options.tokenPremium)
    req.decodedToken = decodedToken
    req.decodedToken.role = "premium"
    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" })
  }
}

export const verifyTokenAdminOrPremium = (req, res, next) => {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"]
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" })
    }
    const tokenParts = authHeader.split(" ")
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return res.status(401).json({ message: "Invalid token format" })
    }
    const token = tokenParts[1]
    let isValidAdminToken = false
    let isValidPremiumToken = false
    let decodedTokenAdmin
    let decodedTokenPremium
    try {
      decodedTokenAdmin = jwt.verify(token, options.tokenAdmin)
      isValidAdminToken = true
    } catch (error) {
    }
    try {
      decodedTokenPremium = jwt.verify(token, options.tokenPremium)
      isValidPremiumToken = true
    } catch (error) {
    }
    if (isValidAdminToken || isValidPremiumToken) {
      req.decodedToken = isValidAdminToken ? decodedTokenAdmin : decodedTokenPremium
      req.decodedToken.role = isValidAdminToken ? "admin" : "premium"
      next()
    } else {
      return res.status(401).json({ message: "Invalid token" })
    }
}

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"]
  if (!authHeader) {
      return res.status(401).json({ message: "No token provided" })
  }
  const tokenParts = authHeader.split(" ")
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return res.status(401).json({ message: "Invalid token format" })
  }
  const token = tokenParts[1]
  let isValidAdminToken = false
  let isValidPremiumToken = false
  let decodedTokenAdmin
  let decodedTokenPremium
  let decodedTokenCommon
  try {
      decodedTokenAdmin = jwt.verify(token, options.tokenAdmin)
      isValidAdminToken = true
  } catch (error) {}
  try {
      decodedTokenPremium = jwt.verify(token, options.tokenPremium)
      isValidPremiumToken = true
  } catch (error) {}
  try {
      decodedTokenCommon = jwt.verify(token, options.token)
  } catch (error) {}
  if (isValidAdminToken) {
      req.decodedToken = decodedTokenAdmin
      req.decodedToken.role = "admin"
  } else if (isValidPremiumToken) {
      req.decodedToken = decodedTokenPremium
      req.decodedToken.role = "premium"
  } else if (decodedTokenCommon) {
      req.decodedToken = decodedTokenCommon
      req.decodedToken.role = "user"
  } else {
      return res.status(401).json({ message: "Invalid token" })
  }
  next()
}