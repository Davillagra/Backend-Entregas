import { usersModel } from "../models/users.js"
import path from "path"

export const switchRole = async (req, res) => {
  const uid = req.params.uid
  try {
    const user = await usersModel.findOne({ _id: uid })
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" })
    }
    if(user.role === "premium"){
      const newRole = "user"
      await usersModel.updateOne({ _id: uid }, { role: newRole })
      return res.status(200).json({ status:"succes", message: `Role switched to ${newRole}` })
    }
    let id,addresVoucher,accountVoucher = false
    user.documents.forEach((file) => {
      if(file.name === "Identificacion"){
        id = true
      }
      if(file.name === "Comprobante de domicilio"){
        addresVoucher = true
      }
      if(file.name === "Comprobante de estado de la cuenta"){
        accountVoucher = true
      }
    })
    if(id && addresVoucher && accountVoucher){
      const newRole = "premium"
      await usersModel.updateOne({ _id: uid }, { role: newRole })
      return res.status(200).json({ status:"succes", message: `Role switched to ${newRole}` })
    } else {
      let needs = []
      if (!id) {needs.push("identificacion")}
      if (!addresVoucher) {needs.push("Comprobante de domicilio")}
      if (!accountVoucher) {needs.push("Comprobante de estado de la cuenta")}
      const errorMessage = `Faltan los siguientes documentes: ${needs.join(', ')}`
      return res.status(406).json({ status: "error", message: errorMessage });
    }
  } catch (error) {
    req.logger.error("Internal Server Error")
    res.status(500).json({ status:"error", message: "Internal Server Error" })
  }
}

export const uploadDocument = async (req, res) => {
  const _id = req.params.uid
  const body = req.files
  const user = await usersModel.findById(_id)
  if(user.email !== req.decodedToken.email){
    req.logger.info("Invalid token")
    return res.status(404).send({ status: "error", message: "Invalid token" })
  }
  if(!body){
    req.logger.error("Body must be an array or a file")
    return res.status(404).send({ status: "error", message: "Body must be an array or a file" })
  }
  if(Array.isArray(body)){
    const array = []
    try {
      body.forEach((file) => {
        const parsed = path.parse(file.originalname)
        array.push({ name: parsed.name, reference: file.path })
      })
      if(user.documents){
        user.documents.forEach((e)=>{
          array.push(e)
        })
      }
      await usersModel.findByIdAndUpdate({ _id }, { documents: array })
      return res.send({ status: "success", message: "User updated", data: array })
    } catch (error) {
      return res.status(500).send({ status: "error", message: error.message })
    }
  }
  else {
    req.logger.error("Body must be an array")
    return res.status(404).send({ status: "error", message: "Body must be an array" })
  }
}

export const deleteUser = async (req, res) => {
  const _id = req.params.id
  try {
    const result = await usersModel.deleteOne({ _id })
    if (result.deletedCount === 0) {
      req.logger.info("User not found")
      res.status(404).send({ status: "error", message: "User not found" })
    } else {
      req.logger.info("User deleted")
      res.send({ status: "success", message: "User deleted successfully" })
    }
  } catch (error) {
    res.status(500).send({ status: "error", message: "Internal server error" })
  }
}