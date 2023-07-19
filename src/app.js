import express from 'express';
import newProducts from './ProductManagerFiles.js';

const app = express();
const PORT = 8080

app.get('/', (req, res) => {
    res.send("Hola a todos")
})

app.get('/products', async (req, res) => {
    let limit = req.query.limit
    let productos = await newProducts.getProducts();
    if(!limit || limit == 0){
        res.send(productos)
    }else{
        productos = productos.slice(0, limit)
        res.send(productos)
    }
})

app.get('/products/:pid', async (req, res) => {
    let productoById = await newProducts.getProductById(Number(req.params.pid))
    res.send(productoById)
})

app.listen(PORT, () => {
    console.log('el servidor esta funcionando')
})