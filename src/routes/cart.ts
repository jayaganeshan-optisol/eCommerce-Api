import { Router, Request, Response } from 'express';
import { cartController } from '../controllers/cart.controller';
import auth from '../middleware/auth';

export const router: Router = Router();
//creating the cart
router.post('/', auth, cartController.createCart);
// getting the user cart
router.get('/', [auth], cartController.getCart);

//updating the quantity of the product
router.post('/update', [auth], cartController.updateCart);

//deleting single product in the cart by user

router.delete('/delete/:id', auth, cartController.deleteProductById);

//delete all item in the cart
router.delete('/delete', auth, cartController.deleteAll);
