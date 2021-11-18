import { Router } from 'express';

import auth from '../middleware/auth';
import admin from '../middleware/admin';
import { orderController } from '../controllers/order.controller';
import { validateOrder } from '../middleware/validate';

export const router: Router = Router();
//create order by user
router.post('/order', [validateOrder, auth], orderController.createOrder);
//find orders by User
router.get('/orders/all', [auth, admin], orderController.ordersByUser);

//delete Order
router.delete('/orders/:id', auth, orderController.cancelOrder);
