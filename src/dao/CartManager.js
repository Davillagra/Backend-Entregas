import { cartModel } from "../models/carts.js"
import { connect } from "./conection.js"

const conection = connect

class CartManager {
    constructor() {}
      getNewCart = async()=>{
        const newCart = new cartModel()
        try {
          const data = await cartModel.create(newCart)
          return data._id
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
          if(cart) {
            const index = cart.products.findIndex((p) => p.product._id.toString() === pid)
            if (index !== -1) {
              cart.products[index].quantity += 1
          } else {
              cart.products.push({ product:pid, quantity: 1 })
          }
          await cart.save()
          }
          return cart
        } catch (error) {
          return error
        }
      }
      deleteProd = async (cid,pid) => {
        try {
          let responce = {}
          const cart = await this.getCartById(cid)
          if(!cart){
            return cart
          } else {
            const index = cart.products.findIndex((p) => p.product._id.toString() === pid)
          if(index == -1){
            responce = {notFound:`Product: ${pid} not fund`}
            return responce
          } else {
            cart.products.splice(index, 1)
            await cart.save()
            responce = {found:`Cart updated`}
            return responce
          }}
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
      putProducts = async (cid, prodArray) => {
        try {
          const cart = await this.getCartById(cid)
          if (!cart) {
            return cart
          }
          prodArray.forEach(async (p) => {
            for (let i = 0; i < p.quantity; i++) {
              await this.pushProducts(cid, p._id)
            }
          })
          return cart
        } catch (error) {
          return error
        }
      }
      updateQuantity = async (cid,pid,prodQuantity) => {
        try {
          const cart = await this.getCartById(cid)
          if(cart){
            const index = cart.products.findIndex((p) => p.product._id.toString() === pid)
            if(index !== -1){
              cart.products[index].quantity = prodQuantity.quantity
              await cart.save()
              return cart
            } else {
              return index
            }
          } else {
            return cart
          }
        } catch (error) {
          return error
        }
      }
      deleteProducts = async (cid) => {
        try {
          const cart = await cartModel.replaceOne({_id:cid},{products:[]})
          return cart
        } catch (error) {
          return error
        }
      }
}

export default CartManager