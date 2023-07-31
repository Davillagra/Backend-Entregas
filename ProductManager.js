const fs = require("fs")

class ProductManager {
  constructor() {
    this.path = "./products.json"
    this.path2 = "./usedIds.json"
  }
  getProducts = async() => {
    if(fs.existsSync(this.path)) {
      const data = await fs.promises.readFile(this.path,"utf-8")
      const product = JSON.parse(data)
      return product
    } else {
      
      await fs.promises.writeFile(this.path,"[]")
    }
  }
  
  addProduct = async (product) => {
    const products = await this.getProducts()
    let actualId
    if(fs.existsSync(this.path2)) {
      const idData = await fs.promises.readFile(this.path2,"utf-8")
      actualId = JSON.parse(idData)
    } else {
      await fs.promises.writeFile(this.path2,"[1]")
      actualId = [0]
    }
    
    let codeExist = false
    products.forEach((e) => {
      if (e.code === product.code) {
        codeExist = true
        return
      }
    })
    if (!codeExist) {
      product.id = actualId[actualId.length - 1 ] + 1
      products.push(product)
      await fs.promises.writeFile(this.path,JSON.stringify(products))
      actualId.push(product.id)
      await fs.promises.writeFile(this.path2,JSON.stringify(actualId))
    } else {
      console.log("No se puede repetir el codigo en dos productos")
    }
  }
  getProductById = async(id) => {
    let idExist = false
    let prodFound = {}
    const products = await this.getProducts()
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
      const products = await this.getProducts()
      const productUpdated = { ...product, ...updateData}
      const index = products.findIndex((p)=>p.id === productUpdated.id)
      products[index] = productUpdated
      await fs.promises.writeFile(this.path,JSON.stringify(products))
      return "El producto se actulizó correctamente"
    }
    
  }
  
  deleteProduct = async(id)=>{
    const product = await this.getProductById(id)
    if(typeof product === "string") {
      return `El producto de id ${id} no existe`
    }else {
      const products = await this.getProducts()
      const index = products.findIndex((p)=> p.id === id)
      products.splice(index,1)
      await fs.promises.writeFile(this.path,JSON.stringify(products))
      return "El producto se borró exitosamente"
    }
    
  }
}

const productos = new ProductManager()

const productsManager = async () => {

const data = {
  title: "producto 2",
  description:"este es otro producto",
  price:200,
  thumbnail:"thumbnail 2",
  code:"codigo 2",
  stock:8
}
const updateData = {
  title: "Nuevo titulo",
  description:"producto actualizado",
  price:400,
  thumbnail:"imagen actualizada",
  stock:5
}
const getProducts = await productos.getProducts()
//productos.addProduct(data)
//const getProductById = await productos.getProductById(1)
//console.log(getProductById)
//const updateProduct = await productos.updateProduct(5,updateData)
//console.log(updateProduct)
//const deleteProduct = await productos.deleteProduct(1)
//console.log(deleteProduct)

}

productsManager()