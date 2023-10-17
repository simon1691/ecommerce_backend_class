import { Router } from "express";
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct } from "../controllers/products.controller.js";
import { validateAdmin } from "../middlewares/validateUsers.js";


const router = Router();

//GET
router.get("/", getProducts);

router.get("/:id", getProductById);

//POST
router.post("/", validateAdmin, addProduct);

//PUT
router.put("/:pid", validateAdmin, updateProduct);

//DELETE
router.delete("/:pid", validateAdmin, deleteProduct);

export default router;
