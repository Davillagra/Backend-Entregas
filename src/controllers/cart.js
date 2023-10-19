import CartManager from "../dao/CartManager.js"
import { usersModel } from "../models/users.js"

const carrito = new CartManager()

export const postNewCart = async (req, res) => {
    const prodArray = req.body
    let newCart
    if (!req.user.cart) {
    newCart = await carrito.getNewCart()
    const data = await usersModel.updateOne({ _id: req.user._id },{ cart: newCart })
    if (newCart.message) {
      return res.status(400).send({ status: "error", message: newCart.message })
    }
    }
    const putProducts = await carrito.putProducts(req.user.cart, [prodArray])
    if (!putProducts) {
      res.send({ status: "error", message: "Cart not found" })
    } else {
      if (!putProducts.message) {
        res.status(201).send({ status: "success", message: `Products added`, id:req.user.cart._id})
      }
    }
}
export const getCart = async (req, res) => {
  const cid = req.params.cid
  const getCartById = await carrito.getCartById(cid)
  if (getCartById) {
    return res.send({ status: "success", message: getCartById })
  } else {
    return res.status(404).send({ status: "error", message: "Cart not found" })
  }
}
export const pushProducts = async (req, res) => {
  const cid = req.params.cid
  const pid = req.params.pid
  const push = await carrito.pushProducts(cid, pid)
  if (!push) {
    res.status(404).send({ status: "error", message: "Cart not found" })
  } else {
    if (!push.message) {
      res.status(201).send({ status: "success", message: `Product added` })
    } else {
      res.status(404).send({ status: "error", message: push.message })
    }
  }
}
export const removeProduct = async (req, res) => {
  const cartID = req.params.cid
  const prodID = req.params.pid
  const deleteProd = await carrito.deleteProd(cartID, prodID)
  if (deleteProd.found) {
    res.send({ status: `success`, message: deleteProd.found })
  } else {
    res.status(404).send({ status: `error`, message: deleteProd })
  }
}
export const removeCart = async (req, res) => {
  const cartID = req.params.id
  const deleteCart = await carrito.deleteCart(cartID)
  if (deleteCart.deletedCount == 1) {
    res.send({ status: `success`, message: "Deleted cart" })
  } else {
    res.status(404).send({ status: `error`, message: "No carts found" })
  }
}
export const putProducts = async (req, res) => {
  const cid = req.params.cid
  const prodArray = req.body
  const putProduct = await carrito.putProducts(cid, prodArray)
  if (!putProduct) {
    res.status(404).send({ status: "error", message: "Cart not found" })
  } else {
    if (!putProduct.message) {
      res.status(201).send({ status: "success", message: `Products added` })
    }
  }
}
export const upateQuantity = async (req, res) => {
  const cid = req.params.cid
  const pid = req.params.pid
  const prodQuantity = req.body
  const updateQuan = await carrito.updateQuantity(cid, pid, prodQuantity)
  if (updateQuan.message || updateQuan == -1) {
    if (updateQuan == -1) {
      res.status(404).send({ status: "error", message: "Prod not found" })
    } else {
      res.status(404).send({ status: "error", message: "Cart not found" })
    }
  } else {
    res.status(201).send({ status: "success", message: updateQuan })
  }
}
export const removeProducts = async (req, res) => {
  const cid = req.params.cid
  const deleteProd = await carrito.deleteProducts(cid)
  if (deleteProd.modifiedCount == 1) {
    res.send({
      status: `success`,
      message: `Prodcuts deleted from cart: ${cid}`,
    })
  } else {
    res.status(404).send({ status: `error`, message: "Cart not found" })
  }
}