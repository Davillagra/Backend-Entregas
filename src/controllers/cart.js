import { cartMethod } from "../dao/factory.js"
import { usersModel } from "../models/users.js"

export const postNewCart = async (req, res) => {
  const prodArray = req.body
  if (!req.session.user) {
    const newCart = await cartMethod.getNewCart()
    if (newCart.message) {
      return res.status(400).send({ status: "error", message: newCart.message })
    }
    res.status(201).send({ status: "success", message: "Cart created", id: newCart })
  }
  let updatedUser = await usersModel.findById(req.session.user._id)
  if (!updatedUser.cart) {
    const newCart = await cartMethod.getNewCart()
    if (newCart.message) {
      return res.status(400).send({ status: "error", message: newCart.message })
    }
    const data = await usersModel.updateOne({ _id: updatedUser._id },{ cart: newCart })
    updatedUser = await usersModel.findById(req.session.user._id)
    if (prodArray.quantity) {
      const putProducts = await cartMethod.putProducts(updatedUser.cart, [prodArray])
      console.log(putProducts)
      if (!putProducts) {
        return res.status(400).send({status: "error",message: "Unable to add products to the cart",})
      }
      return res.status(201).send({status: "success",message: "Products added",id: updatedUser.cart._id,})
    }
  }
  if (updatedUser.cart) {
    if (prodArray.quantity) {
      const putProducts = await cartMethod.putProducts(updatedUser.cart, [prodArray])
      if (!putProducts) {
        return res.status(400).send({status: "error",message: "Unable to add products to the cart",})
      }
      return res.status(201).send({status: "success",message: "Products added",id: updatedUser.cart._id,})
    }
  }
}

export const getCart = async (req, res) => {
  const cid = req.params.cid
  const getCartById = await cartMethod.getCartById(cid)
  if (getCartById) {
    return res.send({ status: "success", message: getCartById })
  } else {
    return res.status(404).send({ status: "error", message: "Cart not found" })
  }
}
export const pushProducts = async (req, res) => {
  const cid = req.params.cid
  const pid = req.params.pid
  const push = await cartMethod.pushProducts(cid, pid)
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
  const deleteProd = await cartMethod.deleteProd(cartID, prodID)
  if (deleteProd.found) {
    res.send({ status: `success`, message: deleteProd.found })
  } else {
    res.status(404).send({ status: `error`, message: deleteProd })
  }
}
export const removeCart = async (req, res) => {
  const cartID = req.params.id
  const deleteCart = await cartMethod.deleteCart(cartID)
  //const updatedUser = await usersModel.findOne(req.session.user._id)
  if (deleteCart.deletedCount == 1) {
    res.send({ status: `success`, message: "Deleted cart" })
  } else {
    res.status(404).send({ status: `error`, message: "No carts found" })
  }
}
export const putProducts = async (req, res) => {
  const cid = req.params.cid
  const prodArray = req.body
  const putProduct = await cartMethod.putProducts(cid, prodArray)
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
  const updateQuan = await cartMethod.updateQuantity(cid, pid, prodQuantity)
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
  const deleteProd = await cartMethod.deleteProducts(cid)
  if (deleteProd.modifiedCount == 1) {
    res.send({
      status: `success`,
      message: `Prodcuts deleted from cart: ${cid}`,
    })
  } else {
    res.status(404).send({ status: `error`, message: "Cart not found" })
  }
}

export const purchase = async (req, res) => {
  const cid = req.params.cid
  const {email} = req.body
  const cart = await cartMethod.getCartById(cid)
  let available
  let totPrice = 0
  let unavailable = []
  if (cart) {
    const availability = cart.products.map(p => {
      const isAvailable = p.product.stock > p.quantity
      if (!isAvailable) {
        unavailable.push(p.product.title)
      }
      totPrice += p.product.price*p.quantity
      return isAvailable
    })
    available = availability.every(available => available)
    if (available) {
      res.send({totPrice});
    } else {
      res.status(400).send({ status: "error", message: "Some products are not available", unavailable })
    }
  } else {
    return res.status(404).send({ status: "error", message: "Cart not found" })
  }
}
