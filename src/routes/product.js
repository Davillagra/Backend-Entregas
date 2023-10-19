import { Router } from "express";
import ProductManager from "../dao/ProductManager.js"
import { deleteProduct, getProductById, getProducts, postProduct, updateProduct } from "../controllers/product.js";

const router = Router()

router.get("/", getProducts)
router.get("/:id", getProductById)
router.post("/", postProduct)
router.put(`/:id`, updateProduct)
router.delete(`/:id`, deleteProduct)

export default router