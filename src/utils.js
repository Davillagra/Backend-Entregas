import {fileURLToPath} from "url"
import {dirname} from "path"
import multer from "multer"

const __filepath = fileURLToPath(import.meta.url)
const __dirname = dirname(__filepath)

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,`${__dirname}/public/images`)
    },
    filename: (req,file,cb) =>{
        console.log(file)
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})

export const uploader = multer({storage})

export default __dirname