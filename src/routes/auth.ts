import { Router, Request, Response, json } from 'express';
import { User } from '../models/User';
import { enc, AES } from 'crypto-js';
import { sign } from 'jsonwebtoken';

const Verifier = require('email-verifier');

export const router: Router = Router();
const auth = require('../middleware/auth');
//Creating new User
router.post('/register', async (req: Request, res: Response) => {
  try {
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
      console.log(result.smtpCheck, 'result');
      if (result.smtpCheck == 'false') {
        res.send('enter a valid email');
      } else {
        let user = await User.findOne({ where: { email: req.body.email } });
        if (user) {
          res.send('User already Exists');
        } else {
          const password = AES.encrypt(req.body.password, process.env.PASS_HASH as string).toString();
          user = await User.create({ name: req.body.name, email: req.body.email, password, is_admin: req.body.is_admin, is_premium: req.body.is_premium });
          res.send(user);
        }
      }
    }, 2500);
  } catch (er) {
    res.status(500).send(er);
  }
});

//Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    let user;
    user = await User.findOne({ where: { email: req.body.email } });
    console.log(user);
    if (!user) {
      res.send('No Such User');
    } else {
      const { password }: any = user;
      const pass = AES.decrypt(password, process.env.PASS_HASH as string).toString(enc.Utf8);
      pass !== req.body.password && res.send('Wrong Password');
      const { user_id, isAdmin }: any = user;
      const token = sign({ user_id, isAdmin }, process.env.SEC_HASH as string, { expiresIn: '3d' });
      res.send(token);
    }
  } catch (er) {
    res.send(er);
  }
});
//Change Password
router.post('/changepassword', auth, async (req: Request, res: Response) => {
  try {
    let user: any;
    user = await User.findByPk(req.body.tokenPayload.user_id);
    if (!user) {
      res.send('No Such User');
    } else {
      const { password }: any = user;
      const pass = AES.decrypt(password, process.env.PASS_HASH as string).toString(enc.Utf8);
      pass !== req.body.oldPassword && res.send('Password do not match');
      const newPass = AES.encrypt(req.body.newPassword, process.env.PASS_HASH as string).toString();
      user.password = newPass;
      await user.save();
      res.send(user);
    }
  } catch (er) {
    res.send(er);
  }
});
