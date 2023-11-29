import { verifyJWT } from "../utils.js";
import CustomError from "../services/errors/customError.js";
import { EErrors } from "../services/errors/errors-enum.js";

export const validateUser = async (req, res, next) => {
  try {
    let user = verifyJWT(req.cookies["jwtCookieToken"]);
    if (user.role === "admin") {
      res.status(403).send({
        payload: {          
          message:  `As ${user.role} user you do not have permission to access this resource`,
          success:false
        }
      });
      CustomError.createError({
        name: "User does not have permission to access this resource",
        message: `As ${user.role} user you do not have permission to access this resource`,
        code: EErrors.ROUTING_ERROR,
        cause: "User does not have permission to access this resource",
      });
    }
    next();
  } catch (error) {
    req.logger.error(error.name, {
      message: error.message,
      code: error.code,
    });
  }
};

export const validateAdminPremium = async (req, res, next) => {
  try {
    let user = verifyJWT(req.cookies["jwtCookieToken"]);
    if (user.role === "user") {
      res.status(403).send({
        payload: {
          message: "as User you do not have permission to access this resource",
          success:false
        }
      });
      CustomError.createError({
        name: "User does not have permission to access this resource",
        message: "As User you do not have permission to access this resource",
        code: EErrors.ROUTING_ERROR,
        cause: "User does not have permission to access this resource",
      });
    }
    next();
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
    if (user.role === "user" || user.role === "premium") {
      res.status(403).send({
        payload: {
          message: `As ${user.role} user you do not have permission to access this resource`,
          success:false
        }
      });
      CustomError.createError({
        name: "User does not have permission to access this resource",
        message: "As User you do not have permission to access this resource",
        code: EErrors.ROUTING_ERROR,
        cause: "User does not have permission to access this resource",
      });
    }
    next();
  } catch (error) {
    req.logger.error(error.name, {
      message: error.message,
      code: error.code,
    });
  }
};
