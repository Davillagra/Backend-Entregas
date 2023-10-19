import ProductManager from "../dao/ProductManager.js"

const productos = new ProductManager()

export const userProducts = async (req,res) => {
    const limit = req.query.limit || 10
    const page = req.query.page || 1
    const query = req.query.query
    const sort = req.query.sort || ""
    const productsa = await productos.getProds(limit,page,sort,query)
    const products  = []
    productsa.docs.forEach(e => {
        products.push({_id:e._id,title:e.title,description:e.description,price:e.price,thumbnail:e.thumbnail,code:e.code,stock:e.stock})
    })
    res.render(`products`,{products,hasNextPage:productsa.hasNextPage,hasPrevPage:productsa.hasPrevPage,nextPage:productsa.nextPage,prevPage:productsa.prevPage,user:req.session.user})
}

export const adminProducts = async (req,res) => {
    const limit = req.query.limit || 10
    const page = req.query.page || 1
    const query = req.query.query
    const sort = req.query.sort || ""
    const productsa = await productos.getProds(limit,page,sort,query)
    const products  = []
    productsa.docs.forEach(e => {
        products.push({_id:e._id,title:e.title,description:e.description,price:e.price,thumbnail:e.thumbnail,code:e.code,stock:e.stock,category:e.category})
    })
    res.render(`realTimeProducts`,{products,hasNextPage:productsa.hasNextPage,hasPrevPage:productsa.hasPrevPage,nextPage:productsa.nextPage,prevPage:productsa.prevPage,user:req.session.user})
}