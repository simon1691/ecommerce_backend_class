import { Router } from "express";
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct } from "../controllers/products.controller.js";
import { validateAdminPremium } from "../middlewares/validateUsers.js";


const router = Router();

//GET
router.get("/", getProducts);

router.get("/:id", getProductById);

//POST
router.post("/", validateAdminPremium, addProduct);

//PUT
router.put("/:pid", validateAdminPremium, updateProduct);

//DELETE
router.delete("/:pid", validateAdminPremium, deleteProduct);

export default router;
