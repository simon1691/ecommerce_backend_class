import express from 'express';
import __dirname from './utils.js'
import handlebars from 'express-handlebars'

import mongoose from 'mongoose';

import viewsRoutes from './routers/views.routes.js'
import productsRoutes from './routers/products.routes.js'
import cartsRoutes from './routers/carts.routes.js'


const app = express();
const PORT = 8181


//para que el servidor pueda recibir obj json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// para trabajar con archivos estaticos
app.use(express.static(__dirname + '/public'))

//Routers
app.use('/', viewsRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/carts', cartsRoutes)

//Configuracion handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views/');
app.set('view engine', 'handlebars');


app.listen(PORT, () => {
    console.log('el servidor esta funcionando')
})


//Conect to the MongoDb
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')
    console.log('Conectado a la base de datos de mongo')
  } catch (error) {
    console.log('error: ' + error)
  }
}

connectDB()