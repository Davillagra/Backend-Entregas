import { productModel } from "../models/products.js"
import { connect } from "./conection.js"

const conection = connect

class ProductManager {
  constructor() {}
  getProducts = async(limit,page,sort,query) => {
    let products
    let filter = {}
    if (query === "disponible") {
      filter.stock = { $gt: 0 }
    } else if (query === "no disponible") {
      filter.stock = { $eq: 0 }
    }
    if(sort){
      products = await productModel.paginate(filter,{limit:limit,page:page,sort:{price:sort}})
    } else {
      products = await productModel.paginate(filter,{limit:limit,page:page})
    }
    return products
  }
    getProductById = async(id) => {
      const product = await productModel.findOne({_id:id})
      return product
  }
  addProduct = async (product) => {
    try {
      await productModel.create(product)
      return "Porduct/s created"
    } catch (error) {
      return error
    }
  }
  updateProduct = async(id,updateData)=>{
    try {
        await productModel.updateOne({_id:id},updateData,{runValidators:true})
        return "Product updated"
    } catch (error) {
      return error
    }
  }
  deleteProduct = async(id)=>{
    try {
      await productModel.deleteOne({_id:id})
      return "Product deleted"
    } catch (error) {
      return error
    }
  }
}

export default ProductManager