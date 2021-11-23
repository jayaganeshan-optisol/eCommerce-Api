import { Router } from "express";
import auth from "../middleware/auth";
import { productController } from "../controllers/product.controller";
import { validateProductUpdate, validateProduct } from "../middleware/validation/productValidation";
import { validateParamsId } from "../middleware/validation/paramsValaditor";
import { Admin_Seller_Both, all } from "../services/Roles";

export const router: Router = Router();
//Post a product by admin
router.post("/create", validateProduct, auth(Admin_Seller_Both), productController.createProduct);
//Delete Product by admin
router.delete("/remove/:id", auth(Admin_Seller_Both), productController.deleteProduct);
//update product by admin
router.patch("/update/:id", validateParamsId, validateProductUpdate, auth(Admin_Seller_Both), productController.updateProduct);
//get all Products
router.get("/all", auth(all), productController.getAllProduct);
//get product by product Id
router.get("/:id", validateParamsId, auth(all), productController.getProductById);
