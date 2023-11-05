import userModel from "../../models/users.model.js";
import UsersDTO from "../DTO/user.dto.js";
import { isValidPassword } from "../../../utils.js";

export default class UserManagerService {
  constructor() {}

  login = async (email, password) => {
    let user = await userModel.findOne({ email });
    if (!user || !isValidPassword(user, password)) {
      return null;
    }
    user = new UsersDTO(user);
    return user;
  };
}
