import passport from "passport";
import passportLocal from "passport-local";
import { createHash, isValidPassword } from "../utils.js";
import userModel from "../services/mongoDb/models/users.model.js";
import GitHubStrategy from "passport-github2";

// declaracion de estrategia (local)
const localStrategy = passportLocal.Strategy;

const initializePassport = () => {
  // github strategy
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.dddeac714ae5130e",
        clientSecret: "01d17b3528968298eafc70abd27bf4f846b27ccf",
        callbackUrl: "http://localhost:8181/api/sessions/githubcallback"
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("name",profile._json.name);

        try {
          const user = await userModel.findOne({ email: profile._json.email });
          console.log("Usuario encontrado para login:");

          if (!user) {
            console.log(
              "El usuario no existe: " + profile._json.email
            );
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: 18,
              email: profile._json.email,
              password: "",
              loggedBy: "GitHub",
            };

            const result = await userModel.create(newUser);
            done(null, result);
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  //register user local stratetegy
  passport.use(
    "register",
    new localStrategy(
      // passReqToCallback: para convertirlo en un callback de request, para asi poder interacturar con la data que viene del cliente
      // usernameField: renombramos el username
      { passReqToCallback: true, usernameField: "email" },

      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          const exist = await userModel.findOne({ email });
          if (exist) {
            return res
              .status(400)
              .send({ status: "error", message: "Usuario ya existe" });
          }
          const user = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };

          const result = await userModel.create(user);
          res.status(200).send({
            status: "Success",
            message: "el Usuario se ha creado con exito" + result.first_name,
          });

          return done(null, result);
        } catch (error) {
          return done("Error registrando el usuario: " + error);
        }
      }
    )
  );

  //login
  passport.use(
    "login",
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });

          if (!user) {
            res.status(404).send({
              status: "Error",
              message: "Credenciales incorrectas o el usuario no existe",
            });

            return done(null, false);
          }
          // Validacion de el password
          if (!isValidPassword(user, password)) {
            res
              .status(401)
              .send({ status: "error", message: "Credenciales incorrectas" });
            return done(null, false);
          }

          req.session.user = {
            first_name: user.first_name,
            last_name: user.last_name,
            age: user.age,
            email: user.email,
          };
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //Funciones de Serializacion y Desserializacion
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await userModel.findById(id);
      done(null, user);
    } catch (error) {
      console.error("Error deserializando el usuario: " + error);
    }
  });
};

export default initializePassport;
