import { connect } from "../config/conection.js"
import { options } from "../config/options.js"

let productMethod
switch(options.server.persistence){
    case "MONGO":
        const connection = connect
        const {ProductManager} = await import("./mongo/ProductManager.js")
        productMethod = new ProductManager()
    break
    case "LOCAL":
        const {ProductManagerLocal} = await import("./local/ProductManager.js")
        productMethod = new ProductManagerLocal()
    break
}
export {productMethod}
let cartMethod
switch(options.server.persistence){
    case "MONGO":
        const connection = connect
        const {CartManager} = await import("./mongo/CartManager.js")
        cartMethod = new CartManager()
    break
    case "LOCAL":
        const {CartManagerLocal} = await import("./local/CartManager.js")
        cartMethod = new CartManagerLocal()
    break
}
export {cartMethod}