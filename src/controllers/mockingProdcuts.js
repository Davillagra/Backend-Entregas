import { generateProducts } from "../utils.js"
import fs from "fs"

export const mockingProdcuts = async (req,res) =>{
    let result = generateProducts()
    await fs.promises.writeFile(`./src/data/products.json`,JSON.stringify(result))
    res.send({result})
}