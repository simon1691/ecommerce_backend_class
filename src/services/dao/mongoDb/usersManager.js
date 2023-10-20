import userModel from "../../models/users.model.js";
import UsersDTO from "../DTO/user.dto.js";
import { isValidPassword } from "../../../utils.js";

export default class UserManagerService {
  constructor() {}

  login = async (email, password) => {
    let user = await userModel.findOne({ email });
    

    if (!user) {
      return {
        success: false,
        status: 401,
        message: "Usario no existe",
        user: null,
      };
    }

    if (!isValidPassword(user, password))
      return {
        success: false,
        status: 401,
        message: "Usario o credenciales incorrectas",
        user: null,
      };
    
      user = new UsersDTO(user);
    return {
      success: true,
      status: 200,
      message: "Logueo exitoso",
      user: user,
    };
  };
}
