import express from 'express';
import handlebars from 'express-handlebars'
import productsRoutes from './routers/products.routes.js'
import cartsRoutes from './routers/carts.routes.js'
import __dirname from './utils.js'
import { Server} from 'socket.io'
import productManager from './ProductManagerFiles.js';


const app = express();
const PORT = 8080



//para que el servidor pueda recibir obj json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// para trabajar con archivos estaticos
app.use(express.static(__dirname + '/public'))

//Routers
app.use('/api/products', productsRoutes)
app.use('/api/carts', cartsRoutes)

//Configuracion handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views/');
app.set('view engine', 'handlebars');


app.get("/realTimeProducts", async (req, res) => {
  try {
    let products = await productManager.getProducts();
    //Se instancia el socket del lado del server
    const socketServer = new Server(httpServer)
    // Canal de comunicaion abierto
    socketServer.on('connection', socket => {
        socket.emit('products', products)
    })
    res.render('realTimeProducts')

  } catch (error) {
    console.error(error);
  }
});


const httpServer = app.listen(PORT, () => {
    console.log('el servidor esta funcionando')
})

