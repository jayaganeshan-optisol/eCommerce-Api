import { Router } from 'express';
import auth from '../middleware/auth';
import admin from '../middleware/admin';
import { userController } from '../controllers/user.controller';

export const router: Router = Router();
//Creating new User
router.post('/register', userController.register);

//Login
router.post('/login', userController.login);
//Change Password
router.post('/changepassword', auth, userController.changepassword);
//get all users

router.get('/users', [auth, admin], userController.findAll);
//adding shipping address

router.patch('/update/shipping', [auth], userController.addShipping);

router.get('/test', (req, res) => {
  throw new Error();
});
