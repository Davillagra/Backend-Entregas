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
