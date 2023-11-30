import { productModel } from "../../models/products.js"

export class ProductManager {
  constructor() {}
  getProds = async(limit,page,sort,query) => {
    limit = limit || 10
    page = page || 1
    sort = sort || ""
    let products
    let filter = {}
    switch (query) {
      case "not available":
        filter.stock = { $eq: 0}
        break
      case "Category1":
      case "Category2":
      case "Category3":
        filter.category = query
        break  
      default:
        filter.stock = { $gt: 0 }
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
    try {
      const product = await productModel.findOne({_id:id})
      return product
    } catch (error) {
      return error
    }
    
  }
  addProduct = async (product) => {
    try {
      const result = await productModel.create(product)
      return result
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
      const result = await productModel.deleteOne({_id:id})
      return result
    } catch (error) {
      return error
    }
  }
}

export default ProductManager