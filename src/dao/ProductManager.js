import { productModel } from "../models/products.js"
import { connect } from "./conection.js"

const conection = connect

class ProductManager {
  constructor() {}
  getProducts = async(limit) => {
      const products = await productModel.find().limit(limit)
      return products
  }
    getProductById = async(id) => {
    try {
      const product = await productModel.findOne({_id:id})
      return product
    } catch (error) {
      return error
    }
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