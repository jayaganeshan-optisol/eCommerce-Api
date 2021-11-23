import { Router } from "express";
import auth from "../middleware/auth";
import { userController } from "../controllers/user.controller";
import { User } from "../models/User";
import { ValidateChangePassword, ValidateLogin, validateRegister, ValidateShippingAddress } from "../middleware/validation/userValidation";
import { all, onlyAdmin, Seller_Buyer_Both } from "../services/Roles";

export const router: Router = Router();
//Creating new User
router.post("/register", validateRegister, userController.register);

//Login
router.post("/login", ValidateLogin, userController.login);
//Change Password
router.post("/changepassword", ValidateChangePassword, auth(all), userController.changePassword);
//get all users

router.get("/user/all", auth(onlyAdmin), userController.findAll);
//adding shipping address

router.patch("/update/shipping", ValidateShippingAddress, auth(Seller_Buyer_Both), userController.shippingUpdate);

router.get("/test", (req: any, res: any) => {
  const user = User.findByPk(3);
  res.send(user);
});
