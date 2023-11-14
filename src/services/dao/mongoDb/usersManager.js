import userModel from "../../models/users.model.js";
import UsersDTO from "../DTO/user.dto.js";
import { isValidPassword, createHash } from "../../../utils.js";

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

  updateRole = async (id) => {
    let user = await userModel.findById(id);
    if (!user || user.role === "admin") {
      return null;
    }
    user = new UsersDTO(user);
    user.role === "user"
      ? await userModel.updateOne({ _id: id }, { role: "premium" })
      : await userModel.updateOne({ _id: id }, { role: "user" });

    return user;
  };

  updatePassword = async (email, password) => {
    let user = await userModel.findOne({ email });
    // if user is not found  returns null
    if (!user) return null;
    
    // validates if the password is the same as the old one and returns false
    let samePass = isValidPassword(user, password);
    if (samePass) return false;

    // updates the password for the user
    await userModel.updateOne(
      { _id: user._id },
      { password: createHash(password) }
    );

    user = new UsersDTO(user);

    return user;
  };
}
