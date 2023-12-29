export default class userDTO {
  constructor(user) {
    this.id = user.id;
    this.email = user.email;
    this.role = user.role;
    this.name = `${user.first_name} ${user.last_name}`;
    this.carts = user.carts;
    this.lastLogin = user.lastLogin
  }
}
