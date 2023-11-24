import { Router } from "express";
import { deleteProduct, getProductById, getProducts, postProduct, updateProduct } from "../controllers/product.js";
import { verifyToken, verifyTokenAdmin,verifyTokenAdminOrPremium,verifyTokenPremium } from "../controllers/jwt.js";

const router = Router()

router.get("/", getProducts)
router.get("/:id", getProductById)
router.post("/",verifyTokenAdminOrPremium, postProduct)
router.put(`/:id`,verifyTokenAdmin, updateProduct)
router.delete(`/:id`,verifyTokenAdmin, deleteProduct)

export default router