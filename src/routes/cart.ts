import { Router, Request, Response } from 'express';
import { Op } from 'sequelize';
import { Cart, validateCart } from '../models/Cart';
import { Product } from '../models/Products';
import { User } from '../models/User';
import auth from '../middleware/auth';

export const router: Router = Router();
//creating the cart
router.post('/', auth, async (req: Request, res: Response) => {
  const { product_id, quantity } = req.body;
  const { user_id } = req.body.tokenPayload;
  const { error } = validateCart({ user_id, product_id, quantity });
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const exists = await Cart.findOne({ where: { user_id, product_id } });
  if (exists) {
    return res.redirect('/update');
  }
  const cart = await Cart.create({ user_id, product_id, quantity });
  res.send(cart);
});
// getting the user cart
router.get('/', [auth], async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const cart = await User.findAll({ include: Product, where: { user_id } });
  res.send(cart);
});

//updating the quantity of the product
router.post('/update', [auth], async (req: Request, res: Response) => {
  const { product_id, quantity } = req.body;
  const { user_id } = req.body.tokenPayload;
  const cart = await Cart.findOne({ where: { user_id } });
  if (cart) {
    cart.update({ quantity }, { where: { product_id } });
    await cart.save();
    res.status(204).end();
  } else {
    res.status(400).send('wrong details');
  }
});

//deleting single product in the cart by user

router.delete('/delete/:id', auth, async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const product_id = req.params.id;
  const cart = await Cart.findOne({ where: { [Op.and]: [{ user_id }, { product_id }] } });
  if (cart) {
    cart.destroy();
    await cart?.save();
    res.send('Product removed successfully');
  } else {
    res.status(404).send('product do not exists');
  }
});

//delete all item in the cart
router.delete('/delete', auth, async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const cart = await Cart.destroy({ where: { user_id } });
  if (cart > 0) return res.send('Removed successfully');
});
