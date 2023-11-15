import fs from "fs"
import { Faker, es } from '@faker-js/faker'

const faker = new Faker({ locale: [es] })

export class ProductManagerLocal {
  constructor() {
    this.path = "./src/data/products.json"
  }
  getProds = async() => {
    if(fs.existsSync(this.path)) {
      const products = {}
      const data = await fs.promises.readFile(this.path,"utf-8")
      products.docs = JSON.parse(data)
      return products
    } else {
      return await fs.promises.writeFile(this.path,"[]")
    }
  }
  addProduct = async (product) => {
    const result = await this.getProds()
    const products = result.docs
    let codeExist = false

    products.forEach((p) => {
      product.forEach((e)=>{
        if (e.code === p.code) {
        codeExist = true
      }
      })
    })
    if (!codeExist) {
      product.forEach((e)=>{
        e.id = faker.database.mongodbObjectId()
        products.push(e)
      })
      await fs.promises.writeFile(this.path,JSON.stringify(products))
      return product
    } else {
      products.message = "No se puede repetir el codigo en dos productos"
      return products
    }
  }
  getProductById = async(id) => {
    let idExist = false
    let prodFound = {}
    const result = await this.getProds()
    const products = result.docs
    products.forEach((e) => {
      if (e.id === id) {
        idExist = true
        return (prodFound = { ...e })
      }
    })
    if (idExist) {
      return prodFound
    } else {
      return `El producto de id ${id} no existe`
    }
  }
  updateProduct = async(id,updateData)=>{
    const product = await this.getProductById(id)
    if(typeof product === "string") {
      return `El producto de id ${id} no existe`
    } else {
      const result = await this.getProds()
      const products = result.docs
      const productUpdated = { ...product, ...updateData}
      const index = products.findIndex((p)=>p.id === productUpdated.id)
      products[index] = productUpdated
      await fs.promises.writeFile(this.path,JSON.stringify(products))
      return `El producto se actulizó correctamente`
    }
  }
  deleteProduct = async(id)=>{
    const product = await this.getProductById(id)
    if(typeof product === "string") {
      return `El producto de id: ${id} no existe`
    }else {
      const result = await this.getProds()
      const products = result.docs
      const index = products.findIndex((p)=> p.id === id)
      products.splice(index,1)
      await fs.promises.writeFile(this.path,JSON.stringify(products))
      const deletedProd = {message:`Se elimino el producto de id: ${id}`,deleteCount:1}
      return deletedProd
    } 
  }
}

export default ProductManagerLocal