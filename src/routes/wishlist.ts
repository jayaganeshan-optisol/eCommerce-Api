import { Router } from "express";
import { wishlistController } from "../controllers/wishlist.controller";
import auth from "../middleware/auth";
import { validateParamsId } from "../middleware/validation/paramsValaditor";
import { validateWishlist } from "../middleware/validation/wishlistValidation";
import { Buyer_Both } from "../services/Roles";
export const router = Router();

//get all products in wishlist by user
router.get("/", auth(Buyer_Both), wishlistController.getAllById);

//add product to wishlist
router.post("/add", auth(Buyer_Both), validateWishlist, wishlistController.addWishlist);
//remove a product from wishlist
router.delete("/remove/:id", validateParamsId, auth(Buyer_Both), wishlistController.removeById);
//remove all products from wishlist

router.delete("/remove", auth(Buyer_Both), wishlistController.removeAll);
