import UserManagerService from "../services/dao/mongoDb/usersManager.js";
import CustomError from "../services/errors/customError.js";
import { EErrors } from "../services/errors/errors-enum.js";
import { createJWT, verifyJWT} from "../utils.js";

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
      accessToken: accessToken,
      user: user,
    });
  } catch (error) {
    req.logger.error(error.name, {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    let userId = req.params.uid;
    let UserRoleUpdated = await usersManager.updateRole(userId);
    if (!UserRoleUpdated) {
      res.status(400).send({
        payload: {
          message: "The ID provided is not valid or belongs to an admin user",
          success: false,
        },
      });
      CustomError.createError({
        name: "invalid ID",
        message: "The ID provided is not valid or belongs to an admin user",
        code: EErrors.INVALID_TYPES,
        cause: "The ID provided is not valid or belongs to an admin user",
      });
    }
    res.status(200).send({
      payload: {
        message: "User role updated successfully",
        success: true,
        user: {
          id: UserRoleUpdated.id,
          newRole: UserRoleUpdated.role,
        },
      },
    });
  } catch (error) {
    req.logger.error(error.name, {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
  }
};

export const UserPassRecovery = async (req, res) => {
  try {
    const email = verifyJWT(req.params.email);
    const  password = req.body.password;
    const userPassUpdated = await usersManager.updatePassword(
      email,
      password
    );
    if (userPassUpdated === null || userPassUpdated === false) {
      res.status(400).send({
        payload: {
          message:
            userPassUpdated === null
              ? "the email provided is not correct or the new password is incorrect"
              : "The password can not be updated using the same password as the old one",
          success: false,
          samePass:  userPassUpdated === false ? true : false,
          userNotFound: userPassUpdated === null ? true : false,
        },
      });
      CustomError.createError({
        name: "Password can no be update (email or password is incorrect)",
        message:
          userPassUpdated === null
            ? "the email provided is not correct or the new password is incorrect"
            : "The password can not be updated using the same password as the old one",
        code: EErrors.INVALID_TYPES,
        cause:
          "The email provided is not correct or the new password is incorrect or same as the old one",
      });
    }
    res.status(200).send({
      payload: {
        message: "Password updated successfully",
        success: true,
        user: {
          id: userPassUpdated.id,
          name: userPassUpdated.name,
        },
      },
    });
  } catch (error) {
    req.logger.error(error.name, {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    let users = await usersManager.getAllUsers()
    if(!users){
      res.status(400).send({
        payload: {
          message: "No Users list created yet ",
          success: false,
        },
      });
      CustomError.createError({
        name: "No Users lists",
        message: "There is not User lists already created",
        code: EErrors.INVALID_TYPES,
        cause: "The user list is empty",
      });
    }
    res.send({
      payload: {
        success: true,
        users: users
      }
    })
  } catch (error) {
    req.logger.error(error.name, {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
  }
}

export const deleteInActiveUsers = async (req, res) => {
  try {
    let deletedUsers = await usersManager.deleteInActiveUsers()
      res.status(200).send({
        payload: {
          message: deletedUsers.length > 0 ? "All unactive Users where deleted" : "All users are active, nothing to be deleted",
          success: true,
          usersDeleted: deletedUsers
        }
      })
  } catch (error) {
     console.error(error)
  }
}
