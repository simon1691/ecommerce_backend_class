import { Router } from "express";
import passport from 'passport';
import { login } from "../controllers/users.controller.js";

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
    res.clearCookie('jwtCookieToken').redirect("/login");
})

router.post("/register", passport.authenticate('register', { failureRedirect: '/api/sessions/fail-register' }), async (req, res) => {
    req.logger.info("Registrando nuevo usuario.");
    res.status(201).send({ status: "success", message: "Usuario creado con extito." })
})


router.post("/login", login)

// Local strategy

// router.post("/login", passport.authenticate("login", { failureRedirect: '/api/sessions/fail-login' }), async (req, res) => {
//     console.log("User found to login:");
//     const user = req.user;

//     if (!user) return res.status(401).send({ status: "error", error: "credenciales incorrectas" });
//     req.session.user = {
//         first_name: user.first_name,
//         last_name: user.last_name,
//         email: user.email,
//         age: user.age
//     }
//     res.send({ status: "success", payload: req.session.user, message: "¡Primer logueo realizado! :)" });
// });



router.get("/fail-register", (req, res) => {
    res.status(401).send({ error: "Failed to process register!" });
});

router.get("/fail-login", (req, res) => {
    res.status(401).send({ error: "Failed to process login!" });
});

export default router;
