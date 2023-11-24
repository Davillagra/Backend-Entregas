import { transport } from "../config/trasnport.js"
import { cartMethod, ticketMethod,productMethod } from "../dao/factory.js"
import { usersModel } from "../models/users.js"

export const postNewCart = async (req, res) => {
  const prodArray = req.body
  if (!req.session.user) {
    const newCart = await cartMethod.getNewCart()
    if (newCart.message) {
      req.logger.error(newCart.message)
      return res.status(400).send({ status: "error", message: newCart.message })
    }
    return res.status(201).send({ status: "success", message: "Cart created", id: newCart })
  }
  let updatedUser = await usersModel.findById(req.session.user._id)
  if (!updatedUser.cart) {
    const newCart = await cartMethod.getNewCart()
    if (newCart.message) {
      req.logger.error(newCart.message)
      return res.status(400).send({ status: "error", message: newCart.message })
    }
    const data = await usersModel.updateOne({ _id: updatedUser._id },{ cart: newCart })
    updatedUser = await usersModel.findById(req.session.user._id)
    if (prodArray.quantity) {
      const putProducts = await cartMethod.putProducts(updatedUser.cart, [prodArray])
      if (!putProducts) {
        req.logger.error("Unable to add products to the cart")
        return res.status(400).send({status: "error",message: "Unable to add products to the cart",})
      }
      req.session.user.cart = updatedUser.cart
      return res.status(201).send({status: "success",message: "Products added",id: updatedUser.cart._id,})
    } else {
      return res.status(201).send({ status: "success", message: "Cart created", id: newCart })
    }
  } else {
    if (prodArray.quantity) {
      const putProducts = await cartMethod.putProducts(updatedUser.cart, [prodArray])
      if (!putProducts) {
        req.logger.error("Unable to add products to the cart")
        return res.status(400).send({status: "error",message: "Unable to add products to the cart",})
      }
      req.session.user.cart = updatedUser.cart
      return res.status(201).send({status: "success",message: "Products added",id: updatedUser.cart._id,})
    }
    return res.status(200).send({ status: "success", message: "Cart already exist"})
  }
}

export const getCart = async (req, res) => {
  const cid = req.params.cid
  const getCartById = await cartMethod.getCartById(cid)
  if (!getCartById.message) {
    return res.send({ status: "success", message: getCartById })
  } else {
    req.logger.error(`No cart found for id: ${cid}`)
    return res.status(404).send({ status: "error", message: `No cart found for id: ${cid}` })
  }
}
export const pushProducts = async (req, res) => {
  const cid = req.params.cid
  const pid = req.params.pid
  let owner = req.user ? req.user.email : req.decodedToken.email
  let role = req.user ? req.user.role : req.decodedToken.role
  if(role === "premium"){
    const product = await productMethod.getProductById(pid)
    if(!product){
      req.logger.error(`No products found for id: ${pid}`)
      return res.status(404).send({status:"error",message:`No products found for id: ${pid}`})
    }
    if(product.owner === owner){
      req.logger.error(`You can't push your own product`)
      return res.status(401).send({status:"error",message:`You can't push your own product`})
    }
  }
  const push = await cartMethod.pushProducts(cid, pid)
  if (!push) {
    req.logger.error(`No cart found for id: ${cid}`)
    res.status(404).send({ status: "error", message: `No cart found for id: ${cid}` })
  } else {
    if (!push.message) {
      res.status(201).send({ status: "success", message: `Product added` })
    } else {
      req.logger.error(push.message)
      res.status(404).send({ status: "error", message: push.message })
    }
  }
}
export const removeProduct = async (req, res) => {
  const cartID = req.params.cid
  const prodID = req.params.pid
  const deleteProd = await cartMethod.deleteProd(cartID, prodID)
  if(!deleteProd){
    req.logger.error(`Cart not found for id:${cartID}`)
    return res.status(404).send({ status: `error`, message: `Cart not found for id:${cartID}` })
  }
  if (deleteProd.found) {
    res.send({ status: `success`, message: deleteProd.found })
  } else {
    req.logger.error(`No product found for id:${prodID}`)
    res.status(404).send({ status: `error`, message: `No product found for id:${prodID}` })
  }
}
export const removeCart = async (req, res) => {
  const cartID = req.params.id
  const deleteCart = await cartMethod.deleteCart(cartID)
  if (deleteCart.deletedCount == 1) {
    res.send({ status: `success`, message: `Deleted cart, id: ${cartID}` })
  } else {
    req.logger.error(`No cart found for id: ${cartID}`)
    res.status(404).send({ status: `error`, message: `No cart found for id: ${cartID}` })
  }
}
export const putProducts = async (req, res) => {
  const cid = req.params.cid
  const prodArray = req.body
  const putProduct = await cartMethod.putProducts(cid, prodArray)
  let flag = false
  console.log(req.decodedToken)
  prodArray.forEach((p)=> p)
  if (!putProduct) {
    req.logger.error(`No cart found for id: ${cid}`)
    res.status(404).send({status: "error", message: `No cart found for id: ${cid}`})
  } else {
    if (!putProduct.message) {
      res.status(201).send({ status: "success", message: putProduct })
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
      req.logger.error(`No product found for id: ${pid}`)
      res.status(404).send({ status: "error", message: `No product found for id: ${pid}` })
    } else {
      req.logger.error(`No cart found for id: ${cid}`)
      res.status(404).send({ status: "error", message: `No cart found for id: ${cid}` })
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
    req.logger.error(deleteProd.message)
    res.status(404).send({ status: `error`, message: deleteProd.message })
  }
}

export const purchase = async (req, res) => {
  const cid = req.params.cid
  const {email} = req.body
  const cart = await cartMethod.getCartById(cid)
  if (!cart) {
    req.logger.error(`No cart found for id: ${cid}`)
    return res.status(404).send({ status: "error", message: `No cart found for id: ${cid}` });
  }
  let available = []
  let totPrice = 0
  let unavailable = []
  let prodInfo = {}
  if (!cart.message) {
    const availability = cart.products.map(p => {
      const isAvailable = p.product.stock > p.quantity
      prodInfo = {title:p.product.title,id:p.product._id,quantity:p.quantity,stock:p.product.stock}
      if (!isAvailable) {
        unavailable.push(prodInfo)
      } else {
        available.push(prodInfo)
        totPrice += p.product.price*p.quantity
      }
      return isAvailable
    })
    if (available.length === cart.products.length) {
      let ticket = await ticketMethod.newTicket(totPrice,email)
      available.forEach((p)=>{productMethod.updateProduct(p.id,{stock:p.stock-p.quantity})})
      let result = transport.sendMail({
        from:`Coder Tickets <zorkanoid@gmail.com>`,
        to:email,
        subject:`Comprobante de ticket`,
        html:`
        <div>
            <h1>Numero de ticket: ${ticket.code} </h1>
        </div>
        `,
        attachments:[]
    })
      await cartMethod.deleteCart(cid)
      res.send({status: "success", message: "Compra exitosa", ticket:ticket})
    } else {
      req.logger.info(`Some product/s are not avialable ${unavailable}`)
      res.status(400).send({ status: "error", message: `Some product/s are not avialable ${unavailable}`})
    }
  }
}
