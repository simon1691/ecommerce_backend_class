import express from 'express';
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose';

//routers
import viewsRoutes from './routers/views.routes.js'
import productsRoutes from './routers/products.routes.js'
import cartsRoutes from './routers/carts.routes.js'
import sessionRoutes from './routers/session.routes.js'

//passport
import passport from 'passport';
import initializePassport from './config/passport.config.js';

//Session store
import session from 'express-session';
import MongoStore from 'connect-mongo';

const app = express();
const PORT = 8181
const MONGO_URL = "mongodb://127.0.0.1:27017/ecommerce";

//para que el servidor pueda recibir obj json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// para trabajar con archivos estaticos
app.use(express.static(__dirname + '/public'));

app.use(session({
  store: MongoStore.create({
    mongoUrl: MONGO_URL,
    // mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true},
    ttl: 3600
  }),
    secret: "coderS3cr3t",
    resave: false, //guarda en memoria
    saveUninitialized: false, //lo guarda a penas se crea
}))

//Middlewares Passport
initializePassport();
app.use(passport.initialize())
app.use(passport.session())

//Routers
app.use('/', viewsRoutes)
app.use('/api/sessions',sessionRoutes)
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
    await mongoose.connect(MONGO_URL)
    console.log('Conectado a la base de datos de mongo')
  } catch (error) {
    console.log('error: ' + error)
  }
}

connectDB()
