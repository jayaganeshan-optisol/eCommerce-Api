import { sign } from 'jsonwebtoken';
import { AES, enc } from 'crypto-js';
import { Request, Response } from 'express';
import { validateUser, User } from '../models/User';

const Verifier = require('email-verifier');
const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const { error } = validateUser({ name, email, password });
  if (error) {
    return res.status(400).send(error.details[0].message);
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
    if (result.smtpCheck == 'false') {
      res.send('enter a valid email');
    } else {
      let user = await User.findOne({ where: { email: req.body.email } });
      if (user) {
        res.send('User already Exists');
      } else {
        const password = AES.encrypt(req.body.password, process.env.PASS_HASH as string).toString();
        user = await User.create({ name: req.body.name, email: req.body.email, password, is_admin: req.body.is_admin, is_premium: req.body.is_premium, shipping_address: req.body.shipping_address });
        res.send(user);
      }
    }
  }, 2500);
};

const login = async (req: Request, res: Response) => {
  let user: any;
  user = await User.findOne({ where: { email: req.body.email } });
  if (!user) {
    res.send('No Such User');
  } else {
    const { password } = user;
    const pass = AES.decrypt(password, process.env.PASS_HASH as string).toString(enc.Utf8);
    pass !== req.body.password && res.send('Wrong Password');
    const { user_id, is_admin } = user;
    const token = sign({ user_id, is_admin }, process.env.SEC_HASH as string, { expiresIn: '3d' });
    res.header('x-auth', token).send(token);
  }
};
const changepassword = async (req: Request, res: Response) => {
  let user: any;
  user = await User.findByPk(req.body.tokenPayload.user_id);
  if (!user) {
    res.send('No Such User');
  } else {
    const { password }: any = user;
    const pass = AES.decrypt(password, process.env.PASS_HASH as string).toString(enc.Utf8);

    if (pass !== req.body.oldPassword) {
      res.send('Old Password do not match');
    } else {
      const newPass = AES.encrypt(req.body.newPassword, process.env.PASS_HASH as string).toString();
      user.password = newPass;
      await user.save();
      res.status(202).send(user);
    }
  }
};
const findAll = async (req: Request, res: Response) => {
  console.log(req.body.tokenPayload);
  const users = await User.findAll();
  res.send(users);
};
const addShipping = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const [result] = await User.update({ shipping_address: req.body.shipping_address }, { where: { user_id } });
  if (result == 0) {
    res.send('address already exists');
  } else {
    res.send('Address updated successfully');
  }
};
export const userController = { register, login, changepassword, findAll, addShipping };
