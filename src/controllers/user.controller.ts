import { Request, Response } from "express";
import { addShipping, getUserByMail, getAllUsers, loginUser, passwordChange, CreateUser, getUserByID } from "../dao/user.dao.";
import { User } from "../models/User";
import { generateToken } from "../services/generateToken";
import { comparePassword, hashPassword } from "../services/passwordHandling";
const Verifier = require("email-verifier");

//Registering a User
const register = async (req: Request, res: Response) => {
  let user = await getUserByMail(req.body.email);
  if (user) {
    return res.status(403).send("User Already Exists");
  }
  const verifier = new Verifier(process.env.EMAIL_VERIFY);

  verifier.verify(req.body.email, (err: any, data: any) => {
    if (err) {
      console.log(err);
    } else {
      result = data;
    }
  });
  let result: any;
  setTimeout(async () => {
    if (result.smtpCheck == "false") {
      return res.send(404).send({ error: "Enter valid email" });
    } else {
      user = await CreateUser(req.body);
      return res.status(200).send(user);
    }
  }, 3000);
};
// Logging In
const login = async (req: Request, res: Response) => {
  let user: any;
  user = await getUserByMail(req.body.email);
  if (!user) {
    return { statusCode: 404, message: { error: "No users Found" } };
  } else {
    const { password } = user;
    const pass = comparePassword(password, req.body.password);
    if (!pass) return res.status(400).send({ error: "Invalid Password" });
    const { user_id, role } = user;
    const token = generateToken({ user_id, role });
    return res.send({ message: token });
  }
};

//changing Password
const changePassword = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const { oldPassword, newPassword } = req.body;
  let user: any;
  user = await getUserByID(user_id);
  if (!user) {
    return res.status(404).send({ error: "No users Found" });
  } else {
    const { password }: any = user;
    const pass = comparePassword(password, oldPassword);
    if (!pass) {
      return res.status(400).send({ error: "Invalid Old password" });
    } else {
      const newPass = hashPassword(newPassword);
      user.password = newPass;
      await user.save();
      return res.send({ message: "Successfully Changed" });
    }
  }
};

//all Users
const findAll = async (req: Request, res: Response) => {
  const { statusCode, message } = await getAllUsers();
  res.status(statusCode).send(message);
};

//adding Shipping address
const shippingUpdate = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const [result] = await addShipping(user_id, req.body.shipping_address);
  if (result === 1) return res.send("updated successfully");
  return res.send("no changes made");
};
export const userController = { register, login, changePassword, findAll, shippingUpdate };
