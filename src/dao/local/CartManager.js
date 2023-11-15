import fs from "fs"
import { Faker, es } from '@faker-js/faker'

const faker = new Faker({ locale: [es] })

export class CartManagerLocal {
    constructor() {
        this.path = "./src/data/cart.json"
        this.path2 = "./src/data/cartIDs.json"
      }
      getNewCart = async()=>{
        let carts = []
        if(fs.existsSync(this.path)){
            const data = await fs.promises.readFile(this.path,"utf-8")
            carts = JSON.parse(data)
        }
        let newID = faker.database.mongodbObjectId()
        carts.push({id:newID,products:[]})
        await fs.promises.writeFile(this.path,JSON.stringify(carts))
        return newID
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
          cartFound.message = `El carrito de id ${id} no existe`
          return cartFound
        }
      }
      pushProducts = async (cid,pid)=>{
        const cart = await this.getCartById(cid)
        const prodArray = cart.products
        const cartIndex = prodArray.findIndex((c)=>c.product===pid)
        if(cartIndex!==-1){
          cart.products[cartIndex].quantity += 1
        } else {
          cart.products.push({product:pid,quantity:1})
        }
        const data = await fs.promises.readFile(this.path,"utf-8")
        const carts = JSON.parse(data)
        let index = await this.getCartIndex(cid)
        carts[index] = {...cart}
        await fs.promises.writeFile(this.path,JSON.stringify(carts))
        return `Se cargó el producto de id: ${pid} al carrito de id: ${cid}`
      }
      getCartIndex = async (id) => {
        const data = await fs.promises.readFile(this.path,"utf-8")
        const carts = JSON.parse(data)
        const indexFound = carts.findIndex((c)=>c.id === id)
        return indexFound
      }
      deleteCart = async (id) => {
        const data = await fs.promises.readFile(this.path,"utf-8")
        const carts = JSON.parse(data)
        const cartIndex = await this.getCartIndex(id)
        if(cartIndex===-1) {
          return carts
        } else {
          carts.splice(cartIndex,1)
          await fs.promises.writeFile(this.path,JSON.stringify(carts))
          carts.deletedCount = 1
          return carts
        }
      }
}

export default CartManagerLocal