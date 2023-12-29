import {Router} from "express"

const router = Router()

router.get("/", async (req, res)=> {
    req.logger.debug("Prueba de log level Debug!");
    req.logger.http(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
    req.logger.info(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
    req.logger.warning("Prueba de log level warn!");
    req.logger.error("Prueba de log level error2!");
    req.logger.fatal("Prueba de log level fatal!");
    res.send("Prueba de logger exitosa!");

})

export default router