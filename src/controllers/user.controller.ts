import { Request, Response } from "express";
import { User } from "../models/User";
import { comparePassword, hashPassword } from "../services/passwordHandling";
import { generateToken } from "../services/generateToken";
import Joi from "joi";
const Verifier = require("email-verifier");

//Registering a User
const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({ where: { email } });
  if (user) {
    return res.status(403).send("User already Exists");
  }
  const verifier = new Verifier(process.env.EMAIL_VERIFY);
  let result: any;

  verifier.verify(req.body.email, (err: any, data: any) => {
    if (err) {
      console.log(err);
    } else {
      result = data;
    }
  });
  setTimeout(async () => {
    if (result.smtpCheck == "false") {
      res.send("enter a valid email");
    } else {
      const password = hashPassword(req.body.password);
      user = await User.create({ name: req.body.name, email: req.body.email, password, is_admin: req.body.is_admin, is_premium: req.body.is_premium, shipping_address: req.body.shipping_address });
      res.send(user);
    }
  }, 2500);
};
// Logging In
const login = async (req: Request, res: Response) => {
  let user: any;
  user = await User.findOne({ where: { email: req.body.email } });
  if (!user) {
    res.send("No Such User");
  } else {
    const { password } = user;
    const pass = comparePassword(password, req.body.password);
    if (!pass) return res.send("Wrong Password");
    const { user_id, is_admin } = user;
    const token = generateToken({ user_id, is_admin });
    res.header("x-auth", token).send({ token });
  }
};

//changing Password
const changepassword = async (req: Request, res: Response) => {
  let user: any;
  user = await User.findByPk(req.body.tokenPayload.user_id);
  if (!user) {
    res.send("No Such User");
  } else {
    const { password }: any = user;
    const pass = comparePassword(password, req.body.oldPassword);
    if (!pass) {
      res.send("Old Password do not match");
    } else {
      const { error: InvalidPass } = Joi.string().min(8).validate(req.body.newPassword);
      if (InvalidPass) {
        return res.status(400).send("Password is too short");
      }
      const newPass = hashPassword(req.body.newPassword);
      user.password = newPass;
      await user.save();
      res.status(202).send(user);
    }
  }
};

//all Users
const findAll = async (req: Request, res: Response) => {
  const users = await User.findAll();
  res.send(users);
};

//adding Shipping address
const addShipping = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const [result] = await User.update({ shipping_address: req.body.shipping_address }, { where: { user_id } });
  if (result == 0) {
    res.send("address already exists");
  } else {
    res.send("Address updated successfully");
  }
};
export const userController = { register, login, changepassword, findAll, addShipping };
