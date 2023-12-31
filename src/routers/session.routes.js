import { Router } from "express";
import passport from 'passport';
import { login, UserPassRecovery } from "../controllers/users.controller.js";
import MailingService from '../services/mailer/mailer.js';
import { createJWT } from "../utils.js";

const router = new Router();

router.get("/github", passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { });


// githubcallback
router.get("/githubcallback", passport.authenticate('github', { failureRedirect: '/github/error' }), async (req, res) => {
    const user = req.user;
    req.session.user = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age
    };
    req.session.admin = true;
    res.redirect("/");
});

router.get('/logout',(req,res)=>{
    // res.clearCookie('jwtCookieToken').redirect("/login").status(200).send({ success: "true", message: "Se ha cerrado la sesión" });
    res.clearCookie('jwtCookieToken').send({ success: "true", message: "Se ha cerrado la sesión" })
})

router.post("/register", passport.authenticate('register', { failureRedirect: '/api/sessions/fail-register' }), async (req, res) => {
    res.status(201).send({ status: "success", message: "Usuario creado con extito." })
})

router.post("/login", login)

router.post("/forgot-password", async (req, res) => {
    let userEmail = req.body.email
    let emailHashed = createJWT(userEmail)
    const email = {
        from:'SAPECOMMERCE',
        to: userEmail,
        subject:"Restaura tu contrasnea!",
        html:`<div><a target="_blank" href="http://localhost:8181/restore-pass/${emailHashed}">Restaura tu contrasena aqui!</a>`
    }

    const mailingService = new MailingService();
    const emailSent = await mailingService.sendSimpleMail(email)
    res.status(200).send({ status: "success", message: "Email enviado"})
})

router.put("/pass-recovery/:email", UserPassRecovery)

router.get('/fail-register', async (req, res) => {
    res.status(401).send({ success: "false", message: "Usuario ya Existe."})
})

export default router;
