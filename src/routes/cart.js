import { Router } from "express"
import CartManager from "../dao/CartManager.js"
import { usersModel } from "../models/users.js"

const router = Router()
const carrito = new CartManager()

router.post("/", async (req, res) => {
    const prodArray = req.body
    let getNewCart
    if (!req.user.cart) {
    getNewCart = await carrito.getNewCart()
    const data = await usersModel.updateOne({ _id: req.user._id },{ cart: getNewCart })
    if (getNewCart.message) {
      return res.status(400).send({ status: "error", message: getNewCart.message })
    }
    }
    console.log(getNewCart)
    const putProducts = await carrito.putProducts(req.user.cart, [prodArray])
    if (!putProducts) {
      res.send({ status: "error", message: "Cart not found" })
    } else {
      if (!putProducts.message) {
        res.status(201).send({ status: "success", message: `Products added`, id:req.user.cart._id})
      }
    }
})
router.get("/:cid", async (req, res) => {
  const cid = req.params.cid
  const getCartById = await carrito.getCartById(cid)
  if (getCartById) {
    return res.send({ status: "success", message: getCartById })
  } else {
    return res.status(404).send({ status: "error", message: "Cart not found" })
  }
})
router.post("/:cid/product/:pid", async (req, res) => {
  const cid = req.params.cid
  const pid = req.params.pid
  const pushProducts = await carrito.pushProducts(cid, pid)
  if (!pushProducts) {
    res.status(404).send({ status: "error", message: "Cart not found" })
  } else {
    if (!pushProducts.message) {
      res.status(201).send({ status: "success", message: `Product added` })
    } else {
      res.status(404).send({ status: "error", message: pushProducts.message })
    }
  }
})
router.delete(`/:cid/product/:pid`, async (req, res) => {
  const cartID = req.params.cid
  const prodID = req.params.pid
  const deleteProd = await carrito.deleteProd(cartID, prodID)
  if (deleteProd.found) {
    res.send({ status: `success`, message: deleteProd.found })
  } else {
    res.status(404).send({ status: `error`, message: deleteProd })
  }
})
router.delete(`/:id`, async (req, res) => {
  const cartID = req.params.id
  const deleteCart = await carrito.deleteCart(cartID)
  if (deleteCart.deletedCount == 1) {
    res.send({ status: `success`, message: "Deleted cart" })
  } else {
    res.status(404).send({ status: `error`, message: "No carts found" })
  }
})
router.put("/:cid", async (req, res) => {
  const cid = req.params.cid
  const prodArray = req.body
  const putProducts = await carrito.putProducts(cid, prodArray)
  if (!putProducts) {
    res.status(404).send({ status: "error", message: "Cart not found" })
  } else {
    if (!putProducts.message) {
      res.status(201).send({ status: "success", message: `Products added` })
    }
  }
})
router.put("/:cid/products/:pid", async (req, res) => {
  const cid = req.params.cid
  const pid = req.params.pid
  const prodQuantity = req.body
  const updateQuantity = await carrito.updateQuantity(cid, pid, prodQuantity)
  if (updateQuantity.message || updateQuantity == -1) {
    if (updateQuantity == -1) {
      res.status(404).send({ status: "error", message: "Prod not found" })
    } else {
      res.status(404).send({ status: "error", message: "Cart not found" })
    }
  } else {
    res.status(201).send({ status: "success", message: updateQuantity })
  }
})
router.delete(`/:cid/products`, async (req, res) => {
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
})

export default router
