import { Router } from "express";
import { cartController } from "../controllers/cart.controller";
import auth from "../middleware/auth";
import { validateCart } from "../middleware/validation/cartValidation";
import { validateParamsId } from "../middleware/validation/paramsValaditor";
import { Buyer_Both } from "../services/Roles";
export const router: Router = Router();

//creating the cart
router.post("/", auth(Buyer_Both), validateCart, cartController.addCart);
// getting the user cart
router.get("/view", auth(Buyer_Both), cartController.getCart);

//updating the quantity of the product
router.patch("/update", auth(Buyer_Both), validateCart, cartController.updateCart);

//deleting single product in the cart by user

router.delete("/delete/:id", validateParamsId, auth(Buyer_Both), cartController.deleteProductById);

//delete all item in the cart
router.delete("/all/delete", auth(Buyer_Both), cartController.deleteAll);
