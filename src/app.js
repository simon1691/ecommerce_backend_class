import express from 'express';
import productsRoutes from './routers/products.routes.js'
import cartsRoutes from './routers/carts.routes.js'


const app = express();
const PORT = 8080

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productsRoutes)
app.use('/api/carts', cartsRoutes)



app.listen(PORT, () => {
    console.log('el servidor esta funcionando')
})