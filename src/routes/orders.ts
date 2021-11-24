import { Router } from "express";
import auth from "../middleware/auth";
import { orderController } from "../controllers/order.controller";
import { validateParamsId } from "../middleware/validation/paramsValaditor";
import { Buyer_Both, onlyAdmin } from "../services/Roles";
import { validateOrder } from "../middleware/validation/orderValidation";

export const router: Router = Router();
//create order by user
router.post("/", validateOrder, auth(Buyer_Both), orderController.createOrder);
//find orders by User
router.get("/all", auth(onlyAdmin), orderController.ordersByUser);

//delete Order
router.delete("/:id", validateParamsId, auth(Buyer_Both), orderController.deleteOrder);
//place order by cart
router.post("/by/cart", auth(Buyer_Both), orderController.orderCart);

//get orders by user
router.get("/", auth(Buyer_Both), orderController.findOrderByUser);

//get order Items by User
router.get("/:id", auth(Buyer_Both), validateParamsId, orderController.findOrderItemsByUser);
