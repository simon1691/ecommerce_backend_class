import { fileURLToPath } from "url";
import { dirname } from "path";
import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// encriptacion de password
export const createHash = (pass) =>
  bcrypt.hashSync(pass, bcrypt.genSaltSync(10));

export const isValidPassword = (user, pass) => {
  return bcrypt.compareSync(pass, user.password);
};

export const PRIVATE_KEY = "sapBackendSecretKey";

export const createJWT = (user) => {
  return jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '1d' });
  //-->Token generado con duracion en segundos.
};

export const verifyJWT = (token) => {
  let payload = jwt.verify(token, PRIVATE_KEY);
  return payload.user;
};

export const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwtCookieToken"];
  }
  return token;
};


export default __dirname;
