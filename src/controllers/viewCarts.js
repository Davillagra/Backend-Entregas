import { cartMethod } from "../dao/factory.js"

export const getCart = async (req,res) => {
    const cid = req.params.cid
    const cart = await cartMethod.getCartById(cid)
    if(!cart){
        return res.redirect('/products')
    }
    if(cart.message){
        req.logger.info(cart.message)
        return res.redirect('/products')
    }
    let products = []
    cart.products.forEach(p => {
        products.push({cid,_id:p.product._id,title:p.product.title,description:p.product.description,price:p.product.price,thumbnail:p.product.thumbnail,code:p.product.code,stock:p.product.stock,quantity:p.quantity})
    })
    res.render(`carts`,{products})
}