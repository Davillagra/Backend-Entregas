import { Router } from "express"
import { deleteUser, switchRole, uploadDocument } from "../controllers/users.js"
import { verifyToken, verifyTokenAdmin } from "../controllers/jwt.js"
import multer from "multer"
import { v4 } from 'uuid'
import __dirname from "../utils.js"
import path from 'path'

const router = Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = "src/uploads/"
        if (file.fieldname === "product") {
            uploadPath += "products/"
        } else if (file.fieldname === "profile") {
            uploadPath += "profiles/"
        } else if (file.fieldname === "document") {
            uploadPath += "documents/"
        } else {
            uploadPath += "other/"
        }
        cb(null, uploadPath)
  },
    filename: function (req, file, cb) {
    const uniqueName = v4()
    const ext = path.extname(file.originalname).toLowerCase()
    const filename = uniqueName + ext
    cb(null, filename)
  },
})
export const uploadMulter = multer({ storage: storage })

router.get("/premium/:uid", verifyTokenAdmin, switchRole)
router.post("/:uid/documents", verifyToken, uploadMulter.any(), uploadDocument)
router.delete("/delete/:id", verifyTokenAdmin, deleteUser)

export default router
