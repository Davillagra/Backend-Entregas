const {ProductManagerLocal} = await import("../dao/local/ProductManager.js")
let productMethod = new ProductManagerLocal()

//const {CartManager} = await import("../dao/local/CartManager.js")
//let cartMethod = new CartManager()

let products = []
let testPasados = 0

console.log("Test 1: no se puede añadir si el producto es un array vacio")
const addProduct = await productMethod.addProduct([])
if (addProduct === "Producto agregado") {
    console.log("Test 1 pasado")
    testPasados++
} else {
    console.log(`Test 1 no pasado, se recibio ${addProduct}, pero se esperaba "Producto agregado"`)
}

console.log("tests pasados: "+testPasados)