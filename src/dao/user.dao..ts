import { AccountType, User } from "../models/User";
import { generateToken } from "../services/generateToken";
import { comparePassword, hashPassword } from "../services/passwordHandling";

interface IUser {
  name: string;
  email: string;
  password: string;
  role: AccountType;
  shipping_address: string;
}
interface ILogin {
  email: string;
  password: string;
}
interface IPasswordChange {
  oldPassword: string;
  newPassword: string;
}

//find User With Id
export const getUserByMail = async (email: string) => {
  const user = await User.findOne({ where: { email } });
  return user;
};
export const CreateUser = async (userCredentials: IUser) => {
  const user = await User.create({ name: userCredentials.name, email: userCredentials.email, password: userCredentials.password, role: userCredentials.role, shipping_address: userCredentials.shipping_address });
  return user;
};
//User Login
export const loginUser = async (loginCredentials: ILogin) => {};
//changing Password

export const passwordChange = async (user_id: number, passwords: IPasswordChange) => {};
//find user by id
export const getUserByID = async (user_id: number) => {
  const user = await User.findByPk(user_id);
  return user;
};
// get all users

export const getAllUsers = async () => {
  const users = await User.findAndCountAll();
  return { statusCode: 200, message: users };
};

export const addShipping = async (user_id: number, shipping_address: string) => {
  const result = await User.update({ shipping_address }, { where: { user_id } });
  return result;
};
