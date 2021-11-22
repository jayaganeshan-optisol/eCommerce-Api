import { Router } from "express";
import { wishlistController } from "../controllers/wishlist.controller";

export const router = Router();
import auth from "../middleware/auth";
import { validateWishlist } from "../middleware/validate";

//get all products in wishlist by user
router.get("/", auth, wishlistController.getAllById);

//add product to wishlist
router.post("/add", [auth, validateWishlist], wishlistController.add);
//remove a product from wishlist
router.delete("/remove/:id", auth, wishlistController.removeById);
//remove all products from wishlist

router.delete("/remove", auth, wishlistController.removeAll);
