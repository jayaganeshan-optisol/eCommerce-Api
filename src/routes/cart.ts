import { Router, Request, Response } from 'express';
import { Cart } from '../models/Cart';
import { Product } from '../models/Products';
import { User } from '../models/User';

export const router: Router = Router();
const auth = require('../middleware/auth');

router.post('/cart', auth, async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const user: any = await User.findByPk(user_id);
  const product: any = await Product.findByPk(req.body.product_id);
  console.log(user, product);
  try {
    const cart = await Cart.create({ user_id: user.user_id, product_id: product.product_id, quantity: 1 });
    console.log(cart, 'cart');
    res.send(cart);
  } catch (er) {
    res.status(500).send(er);
  }
});
