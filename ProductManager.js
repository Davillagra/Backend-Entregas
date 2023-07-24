class ProductManager {
  constructor() {
    this.products = []
  }
  getProducts = () => {
    return this.products
  }
  getProductById = (id) => {
    let idExist = false
    let prodFound = {}
    this.products.forEach((e) => {
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
  addProduct = (
    title,
    description,
    price,
    thumbnail = "Sin imagen",
    code,
    stock
  ) => {
    const product = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    }
    if (this.products.length === 0) {
      product.id = 1
    } else {
      product.id = this.products[this.products.length - 1].id + 1
    }
    let codeExist = false
    this.products.forEach((e) => {
      if (e.code === product.code) {
        codeExist = true
        return
      }
    })
    if (!codeExist) {
      this.products.push(product)
    } else {
      console.log("No se puede repetir el codigo en dos productos")
    }
  }
}

const productos = new ProductManager()

console.log(productos.getProducts())

productos.addProduct(
  "producto 1",
  "este es un prodcuto",
  500,
  "thumnail",
  "codigo 1",
  6
)

console.log(productos.getProducts())

productos.addProduct(
  "producto 1",
  "este es un prodcuto",
  500,
  "thumnail",
  "codigo 1",
  6
)

console.log(productos.getProductById(0))
