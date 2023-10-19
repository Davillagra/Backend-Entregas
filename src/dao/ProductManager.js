import { productModel } from "../models/products.js"
import { connect } from "../config/conection.js"

const conection = connect

class ProductManager {
  constructor() {}
  getProds = async(limit,page,sort,query) => {
    let products
    let filter = {}
    switch (query) {
      case "available":
        filter.stock = { $gt: 0 }
        break
      case "not available":
        filter.stock = { $eq: 0}
        break
      case "Category1":
      case "Category2":
      case "Category3":
        filter.category = query
        break  
      default:
          break
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
        const update = await productModel.updateOne({_id:id},updateData,{runValidators:true})
        return update
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