import UserManagerService from "../services/dao/mongoDb/usersManager.js";
import CustomError from "../services/errors/customError.js";
import { EErrors } from "../services/errors/errors-enum.js";
import { createJWT } from "../utils.js";

const usersManager = new UserManagerService();

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usersManager.login(email, password);

    if (!user) {
      res.status(400).send({
        success: false,
        message: "User does not exists or credentials are incorrect",
      });
      CustomError.createError({
        name: "User can not be logged in",
        message: "User does not exists or credentials are incorrect",
        code: EErrors.INVALID_TYPES,
        cause: "User does not exists or credentials are incorrect",
      });
    }
    const tokenUser = {
      name: user.name,
      email: user.email,
      role: user.role,
      carts: user.carts,
    };
    const accessToken = createJWT(tokenUser);

    res.cookie("jwtCookieToken", accessToken, {
      maxAge: 60000,
      httpOnly: true, // No se expone la cookie
      // httpOnly: false // expone la cookie
    });

    res.status(200).send({
      success: true,
      message: "User logged in successfully",
    });
  } catch (error) {
    req.logger.error(error.name, {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
  }
};
