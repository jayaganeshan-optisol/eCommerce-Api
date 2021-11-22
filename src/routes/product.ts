import { Router } from "express";
import auth from "../middleware/auth";
import admin from "../middleware/admin";
import { productController } from "../controllers/product.controller";
import { validateProductUpdate, validateProduct } from "../middleware/validation/productValidation";
import { validateParamsId } from "../middleware/validation/paramsValaditor";

export const router: Router = Router();
//Post a product by admin
router.post("/create", [validateProduct, auth, admin], productController.createProduct);
//Delete Product by admin
router.delete("/remove/:id", [validateParamsId, auth, admin], productController.deleteProduct);
//update product by admin
router.patch("/update/:id", [validateParamsId, validateProductUpdate, auth, admin], productController.updateProduct);
//get all Products
router.get("/all", auth, productController.getAllProduct);
//get product by product Id
router.get("/:id", [validateParamsId, auth], productController.getProductById);
