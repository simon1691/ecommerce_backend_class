import { Router } from "express";
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct } from "../controllers/products.controller.js";


const router = Router();

//GET
router.get("/", getProducts);

router.get("/:id", getProductById);

//POST
router.post("/", addProduct);

//PUT
router.put("/:pid", updateProduct);

//DELETE
router.delete("/:pid", deleteProduct);

export default router;
