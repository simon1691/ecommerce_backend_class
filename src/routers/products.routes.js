import { Router } from "express";
import productManager from '../ProductManagerFiles.js'

const router = Router();

//GET
router.get("/", async (req, res) => {
  let limit = req.query.limit;
  let products = await productManager.getProducts();
  if (!limit || limit == 0) {
    res.send(products);
  } else {
    products = products.slice(0, limit);
    res.send(products);
  }
});

router.get("/:pid", async (req, res) => {
  let productById = await productManager.getProductById(req.params.pid);
  res.send(productById);
});

//POST
router.post("/", async (req, res) => {
  let prouctToAdd = req.body;
  await productManager.addProduct(prouctToAdd);

  res.send(prouctToAdd);
});

//PUT
router.put("/:pid", async (req, res) => {
  let productToUpdate = req.body;
  console.log(productToUpdate)
  await productManager.updateProduct(req.params.pid, productToUpdate);

  res.send(productToUpdate);
});

//DELETE
router.delete("/:pid", async (req, res) => {
  await productManager.deleteProduct(req.params.pid);

  res.send('');
});


export default router;
