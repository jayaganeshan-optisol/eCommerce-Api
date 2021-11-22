import { Router } from "express";
import auth from "../middleware/auth";
import admin from "../middleware/admin";
import { userController } from "../controllers/user.controller";
import { User } from "../models/User";
import { ValidateChangePassword, validateRegister, ValidateShippingAddress } from "../middleware/validation/userValidation";
import { ValidateLogin } from "../middleware/validate";

export const router: Router = Router();
//Creating new User
router.post("/register", validateRegister, userController.register);

//Login
router.post("/login", ValidateLogin, userController.login);
//Change Password
router.post("/changepassword", [ValidateChangePassword, auth], userController.changepassword);
//get all users

router.get("/user/all", [auth, admin], userController.findAll);
//adding shipping address

router.patch("/update/shipping", [ValidateShippingAddress, auth], userController.addShipping);

router.get("/test", (req: any, res: any) => {
  const user = User.findByPk(3);
  res.send(user);
});
