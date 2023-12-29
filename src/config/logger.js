import winston, {transports} from 'winston';
import config from "./config.js";


const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    }
};

//devLogger
const devLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console(
        {
            level:"debug",
            format: winston.format.simple()
        }),
        new winston.transports.File({
            filename: './src/logErrors/errors.log',
            level: 'error',
            format: winston.format.simple()
        })
    ]
})

const prodLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console(
        {
            level:"info",
            format: winston.format.simple()
        }),
        new winston.transports.File({
            level: 'error',
            filename: './src/logErrors/errors.log',
            format: winston.format.simple()
        })
    ]
})


//Declare a middleware:
export const addLogger = (req, res, next) => {
    if (config.environment === 'production') {
        req.logger = prodLogger;
    } else {
        req.logger = devLogger;
    }
    next();
};