import { Request, Response } from 'express';
import { Product } from '../models/Products';
import { User } from '../models/User';
import { validateWishlist, WishList } from '../models/WishList';

const getAllById = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const list = await User.findAll({ include: Product, where: { user_id } });
  res.send(list);
};

const add = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const { product_id } = req.body;
  const { error } = validateWishlist({ user_id, product_id });
  if (error) return res.status(400).send(error.details[0].message);
  const list = await WishList.create({ user_id, product_id });
  res.send(list);
};

const removeById = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const { product_id } = req.body;
  const list = await WishList.destroy({ where: { user_id, product_id } });
  if (list > 0) return res.send('removed successfully');
  return res.send('no changes made');
};
const removeAll = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const list = await WishList.destroy({ where: { user_id } });
  if (list > 0) return res.send('removed successfully');
  return res.send('no changes made');
};

export const wishlistController = {
  getAllById,
  add,
  removeAll,
  removeById,
};
