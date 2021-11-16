import { Router, Request, Response } from 'express';
import { Product } from '../models/Products';
import { User } from '../models/User';
import { WishList } from '../models/WishList';

export const router = Router();
import auth from '../middleware/auth';

//get all products in wishlist by user
router.get('/', auth, async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const list = await User.findAll({ include: Product, where: { user_id } });
  res.send(list);
});

//add product to wishlist
router.post('/add', auth, async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const { product_id } = req.body;
  const list = await WishList.create({ user_id, product_id });
  res.send(list);
});
//remove a product from wishlist
router.delete('/remove', auth, async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const { product_id } = req.body;
  const list = await WishList.destroy({ where: { user_id, product_id } });
  if (list > 0) return res.send('removed successfully');
  return res.send('no changes made');
});
//remove all products from wishlist

router.delete('/remove/all', auth, async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const list = await WishList.destroy({ where: { user_id } });
  if (list > 0) return res.send('removed successfully');
  return res.send('no changes made');
});
