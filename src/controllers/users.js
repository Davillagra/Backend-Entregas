import { usersModel } from "../models/users.js"

export const switchRole = async (req, res) => {
  const uid = req.params.uid
  try {
    const user = await usersModel.findOne({ _id: uid })
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" })
    }
    const newRole = user.role === "user" ? "premium" : "user"
    await usersModel.updateOne({ _id: uid }, { role: newRole })
    res.status(200).json({ message: `Role switched to ${newRole}` })
  } catch (error) {
    req.logger.error("Internal Server Error")
    res.status(500).json({ status:"error", message: "Internal Server Error" })
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