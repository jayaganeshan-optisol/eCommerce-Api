import { Request, Response } from "express";
import { addShipping, getUserByMail, getAllUsers, CreateUser, getUserByID } from "../dao/user.dao.";
import { generateToken } from "../services/tokenHandling";
import { comparePassword, hashPassword } from "../services/passwordHandling";
import config from "config";
import { createToken, getToken } from "../dao/token.dao";
import { mail } from "../services/mailer";
import { stripe } from "../app";
const Verifier = require("email-verifier");

//Registering a User
const register = async (req: Request, res: Response) => {
  let user: any = await getUserByMail(req.body.email);
  if (user) {
    return res.status(403).send({ message: "User Already Exists" });
  }
  const verifier = new Verifier(config.get("EMAIL_VERIFY"));

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
      const { id } = await stripe.customers.create({
        name: req.body.name,
        email: req.body.email,
        description: "test customer",
      });
      user = await CreateUser(req.body, id);
      return res.status(200).send(user);
    }
  }, 4000);
};
// Logging In
const login = async (req: Request, res: Response) => {
  let user: any;
  user = await getUserByMail(req.body.email);
  if (!user) {
    return res.status(404).send({ error: "Email Not found in db" });
  } else {
    const { password,} = user;
    const pass = comparePassword(password, req.body.password);
    if (!pass) return res.status(400).send({ error: "Invalid Password" });
    const { user_id, role, stripe_id,name} = user;
    const token = generateToken({ name,user_id, role, stripe_id });
    return res.send({ token: token });
  }
};

//changing new Password for User
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
      user.password = newPassword;
      await user.save();
      console.log(user);
      return res.send({ message: "Successfully Changed" });
    }
  }
};

// Getting all Users by Admin
const findAll = async (req: Request, res: Response) => {
  const users = await getAllUsers();
  return res.send(users);
};

// Adding Shipping address except Admin
const shippingUpdate = async (req: Request, res: Response) => {
  const { user_id, role } = req.body.tokenPayload;
  const [result] = await addShipping(user_id, req.body.shipping_address);
  if (result === 1) return res.send({ message: "updated successfully" });
};
//Start Reset password
const startResetPassword = async (req: Request, res: Response) => {
  const email = req.body.email;
  const user: any = await getUserByMail(email);

  if (!user) return res.status(404).send({ error: "User don't exists" });
  const tokenObject: any = await createToken(user.user_id);
  const link = `${config.get("BASE_URL")}/password-reset/${user.user_id}/${tokenObject.token}`;
  await mail(user.name, user.email, "Password Reset", link);
  return res.send({ message: "password reset link sent to your email account" });
};
const endResetPassword = async (req: Request, res: Response) => {
  const user: any = await getUserByID(parseInt(req.params.order_id));
  if (!user) return res.status(400).send({ error: "Invalid link or expired" });

  const token = await getToken(user.user_id, req.params.token);
  if (!token) return res.status(400).send({ error: "Invalid link or expired" });

  user.password = req.body.password;
  await user.save();
  await token.destroy();
  res.send({ message: "password reset successfully." });
};
export const userController = { register, login, changePassword, findAll, shippingUpdate, startResetPassword, endResetPassword };
