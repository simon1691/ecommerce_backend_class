import { Router } from "express";
import userModel from "../services/mongoDb/models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";

const router = new Router();

router.get('/logout',(req,res)=>{
  req.session.destroy(function (err) {
    req.session = null;
    res.
    status(200)
    .send({
      status: "Success",
      message: "Te has deslogueado con exito"
    });
   });
})

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, age, email, password } = req.body;
    const exists = await userModel.findOne({ email });

    if (exists) {
      return res
        .status(400)
        .send({ status: "error", message: "el Usuario ya existe" });
    }
    const user = {
      first_name,
      last_name,
      age,
      email,
      //password
      password: createHash(password),
    };
    const result = await userModel.create(user);
    res
      .status(200)
      .send({
        status: "Success",
        message: "el Usuario se ha creado con exito" + result.first_name,
      });
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .send({
          status: "Error",
          message: "Credenciales incorrectas o el usuario no existe",
        });
    }

    //validacion con bcript de la password
    if (!isValidPassword(user, password)) {
      return res
        .status(401)
        .send({ status: "error", message: "Credenciales incorrectas" });
    }

    req.session.user = {
      first_name: user.first_name,
      last_name: user.last_name,
      age: user.age,
      email: user.email,
      admin : user.email === "adminCoder@coder.com" ? true : '',
    };
    console.log(req.session.user)

    res
      .status(200)
      .send({
        status: "success",
        payload: req.session.user,
        message: "Logueo exitoso!",
      });
  } catch (error) {
    console.log(error);
  }
});

export default router;
