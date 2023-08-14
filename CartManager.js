import { json } from "express"
import fs from "fs"

class CartManager {
    constructor() {
        this.path = "./data/cart.json"
        this.path2 = "./data/cartIDs.json"
      }
      getNewCart = async()=>{
        let actualCartID
        let carts = []
        let cartIDs = []
        if(!fs.existsSync(this.path2)){
            await fs.promises.writeFile(this.path2,`[${actualCartID}]`)
            actualCartID = 0
        } else {
            const data = await fs.promises.readFile(this.path2,"utf-8")
            cartIDs = JSON.parse(data)
            actualCartID = cartIDs[cartIDs.length - 1]
        }
        if(fs.existsSync(this.path)){
            const data = await fs.promises.readFile(this.path,"utf-8")
            carts = JSON.parse(data)
        }
        cartIDs.push(actualCartID+1)
        carts.push({id:actualCartID,products:[]})
        await fs.promises.writeFile(this.path2,JSON.stringify(cartIDs))
        await fs.promises.writeFile(this.path,JSON.stringify(carts))
        return `Carrito creado con id: ${actualCartID}`
      }
      getCartById = async (id)=>{
        let idExist = false
        let cartFound = {}
        const data = await fs.promises.readFile(this.path,"utf-8")
        const carts = JSON.parse(data)
        carts.forEach((c) => {
          if (c.id === id) {
            idExist = true
            return (cartFound = { ...c })
          }
        })
        if (idExist) {
          return cartFound
        } else {
          return `El carrito de id ${id} no existe`
        }
      }
      pushProducts = async (cid,pid)=>{
        const cart = await this.getCartById(cid)
        const cartIndex = cart.products.findIndex((c)=>c.product===pid)
        if(cartIndex!==-1){
            cart.products[cartIndex].quantity += 1
        } else {
            cart.products.push({product:pid,quantity:1})
        }
        const data = await fs.promises.readFile(this.path,"utf-8")
        const carts = JSON.parse(data)
        carts[cid] = {...cart}
        await fs.promises.writeFile(this.path,JSON.stringify(carts))
        return `Se cargó el producto de id: ${pid} al carrito de id: ${cid}`
      }
}

export default CartManager