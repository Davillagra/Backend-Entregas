import { cartModel } from "../models/carts.js"
import { connect } from "./conection.js"

const conection = connect

class CartManager {
    constructor() {}
      getNewCart = async()=>{
        const newCart = new cartModel()
        try {
          const data = await cartModel.create(newCart)
          return `Carrito generado con id: ${data._id}` 
        } catch (error) {
          return error
        }
      }
      getCartById = async (id)=>{
          const cart = await cartModel.findOne({_id:id})
          return cart
      }
      pushProducts = async (cid,pid)=>{
        try {
          const cart = await this.getCartById(cid)
          if(!cart){
            return cart
          } else {
            const product = cart.products.findIndex((p) => p._id.toString() === pid)
            if (product !== -1) {
              cart.products[product].quantity += 1
          } else {
              cart.products.push({ _id:pid, quantity: 1 })
          }
          await cart.save()
          }
          return cart
        } catch (error) {
          return error
        }
      }
      deleteCart = async (id) => {
        try {
          const deletedCart = await cartModel.deleteOne({_id:id})
          return deletedCart
        } catch (error) {
          return error
        }   
      }
}

export default CartManager