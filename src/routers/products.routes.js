import { Router } from "express";
import productManager from '../ProductManagerFiles.js'

const router = Router();

//GET
router.get("/", async (req, res) => {
  try {
    let limit = req.query.limit;
    let products = await productManager.getProducts();
    // let productsToshow =  JSON.parse(products)
    if (!limit || limit == 0) {

      // llamar la vista homeHandlersBars
      res.render('home',{
        areProducts: products.length > 0,
        products
      });
    } else {
      products = products.slice(0, limit);

      // llamar la vista homeHandlersBars
      res.render('home',{
        areProducts: products.length > 0,
        products
      });
    }

  } catch (error) {
    console.error(error);
  }
});


// router.get("/realTimeProducts", async (req, res) => {
//   try {
//     let products = await productManager.getProducts();
//       // llamar la vista homeHandlersBars
//       res.render('realTimeProducts',{
//         areProducts: products.length > 0,
//         products
//       });
//   } catch (error) {
//     console.error(error);
//   }
// });


router.get("/:pid", async (req, res) => {
  try {
    let productById = await productManager.getProductById(req.params.pid);
    res.send(productById);
  } catch (error) {
    console.error(error);
  }
});

//POST
router.post("/", async (req, res) => {
  try {
    let prouctToAdd = req.body;
    await productManager.addProduct(prouctToAdd);

    res.json(prouctToAdd);
  } catch (error) {
    console.error(error);
  }
});

//PUT
router.put("/:pid", async (req, res) => {
  try {
    let productToUpdate = req.body;
    console.log("test ", productToUpdate)
    await productManager.updateProduct(req.params.pid, productToUpdate);
    let productById = await productManager.getProductById(req.params.pid);

    res.json(productById);
  } catch (error) {
    console.error(error);
  }
});

//DELETE
router.delete("/:pid", async (req, res) => {
  try {
    let productById = await productManager.getProductById(req.params.pid);
    await productManager.deleteProduct(req.params.pid);

    res.json(productById);
  } catch (error) {
    console.error(error);
  }
});


export default router;
