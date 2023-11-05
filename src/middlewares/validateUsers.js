import { verifyJWT } from "../utils.js";
import CustomError from "../services/errors/customError.js";
import { EErrors } from "../services/errors/errors-enum.js";

export const validateUser = async (req, res, next) => {
  try {
    let user = verifyJWT(req.cookies["jwtCookieToken"]);
    if (user && user.role === "user") {
      return next();
    }
    res.status(403).send({
      message: "as Admin you do not have permission to access this resource",
      sucess:false
    });
    CustomError.createError({
      name: "User does not have permission to access this resource",
      message: "As Admin you do not have permission to access this resource",
      code: EErrors.ROUTING_ERROR,
      cause: "User does not have permission to access this resource",
    });
  } catch (error) {
    req.logger.error(error.name, {
      message: error.message,
      code: error.code,
    });
  }
};

export const validateAdmin = async (req, res, next) => {
  try {
    let user = verifyJWT(req.cookies["jwtCookieToken"]);
    if (user && user.role === "admin") {
      return next();
    }
    res.status(403).send({
      message: "as User you do not have permission to access this resource",
      sucess:false
    });
    CustomError.createError({
      name: "User does not have permission to access this resource",
      message: "As User you do not have permission to access this resource",
      code: EErrors.ROUTING_ERROR,
      cause: "User does not have permission to access this resource",
    });
  } catch (error) {
    req.logger.error(error.name, {
      message: error.message,
      code: error.code,
    });
  }
};
