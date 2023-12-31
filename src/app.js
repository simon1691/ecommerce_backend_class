import express from 'express';
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import config from './config/config.js';
import MongoSingleton from './config/mongodb-singleton.js';
import { PRIVATE_KEY } from './utils.js';
import cookieParser from 'cookie-parser';
import { addLogger } from './config/logger.js';

//routers
import viewsRoutes from './routers/views.routes.js'
import productsRoutes from './routers/products.routes.js'
import cartsRoutes from './routers/carts.routes.js'
import sessionRoutes from './routers/session.routes.js'
import mockingProductsRoutes from './routers/mockingProducts.routes.js'
import loggerTestRoutes from './routers/loggerTest.routes.js'
import usersRoutes from './routers/users.routes.js'
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from'swagger-ui-express';

//passport
import passport from 'passport';
import initializePassport from './config/passport.config.js';

//Session store
import session from 'express-session';
import MongoStore from 'connect-mongo';

const app = express();
const PORT = config.port;
const MONGO_URL = config.mongoUrl;

//Logger
app.use(addLogger);

//para que el servidor pueda recibir obj json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      title: 'Documentación API Ecommerce SAP',
      version: '1.0.0',
      description: 'Documentación API Ecommerce SAP',
    }
  },
  apis: ['./src/docs/**/*.yaml'],
}
const specs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

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

app.use(cookieParser(PRIVATE_KEY));

//Routers
app.use('/', viewsRoutes)
app.use('/api/sessions',sessionRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/carts', cartsRoutes)
app.use('/mockingproducts', mockingProductsRoutes)
app.use('/loggerTest', loggerTestRoutes)
app.use('/api/users',usersRoutes)

//Configuracion handlebars
app.engine('handlebars', handlebars.engine());
app.set('partials', __dirname + '/views/partials')
app.set('views', __dirname + '/views/');
app.set('view engine', 'handlebars');


app.listen(PORT, () => {
    console.log('el servidor esta funcionando', PORT)
})

// Conxion coin MOngo 
const mongoInstance = async () => {
  try {
      await MongoSingleton.getInstance();
  } catch (error) {
      console.error(error);
  }
};
mongoInstance()
