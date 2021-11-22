import { Router } from "express";

import auth from "../middleware/auth";
import admin from "../middleware/admin";
import { orderController } from "../controllers/order.controller";
import { validateOrder } from "../middleware/validate";
import { validateParamsId } from "../middleware/validation/paramsValaditor";

export const router: Router = Router();
//create order by user
router.post("/", [validateOrder, auth], orderController.createOrder);
//find orders by User
router.get("/all", [auth, admin], orderController.ordersByUser);

//delete Order
router.delete("/:id", [validateParamsId, auth], orderController.cancelOrder);
