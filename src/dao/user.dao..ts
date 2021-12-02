import { AccountType, User } from "../models/User";

interface IUser {
  name: string;
  email: string;
  password: string;
  role: AccountType;
  shipping_address: string;
}

//find User With Id
export const getUserByMail = async (email: string) => {
  const user = await User.findOne({ where: { email } });
  return user;
};

export const CreateUser = async (userCredentials: IUser, stripe_id: string) => {
  const user = await User.create({ name: userCredentials.name, email: userCredentials.email, password: userCredentials.password, role: userCredentials.role, stripe_id, shipping_address: userCredentials.shipping_address });
  return user;
};
//find user by id
export const getUserByID = async (user_id: number) => {
  const user = await User.findByPk(user_id);
  return user;
};
// get all users

export const getAllUsers = async () => {
  const users = await User.findAll();
  return users;
};

export const addShipping = async (user_id: number, shipping_address: string) => {
  const result = await User.update({ shipping_address }, { where: { user_id } });
  return result;
};
