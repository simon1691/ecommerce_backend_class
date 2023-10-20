import UserManagerService from "../services/dao/mongoDb/usersManager.js";
import { createJWT } from "../utils.js";

const usersManager = new UserManagerService();

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const payload = await usersManager.login(email, password);
    req.user = payload.user;

    if (payload.success === true) {
      const user = payload.user;
      const tokenUser = {
        name: user.name,
        email: user.email,
        role: user.role,
        carts: user.carts
      };
      const accessToken = createJWT(tokenUser);

      res.cookie("jwtCookieToken", accessToken, {
        maxAge: 60000,
        httpOnly: true, // No se expone la cookie
        // httpOnly: false // expone la cookie
      });

      return res.status(payload.status).send({
        success: payload.success,
        message: payload.message,
      });
    }
    return res.status(payload.status).send({
      success: payload.success,
      message: payload.message,
    });
  } catch (error) {
    console.error("request error: " + error);
    res.status(500).send({ error: error });
  }
};
