import { Request, Response } from "express";
import { getUserByID } from "../dao/user.dao.";
import { createWishlist, deleteWishlistByProduct, deleteWishlistByUser, getWishlistByIds } from "../dao/wishlist.dao";
import { WishList } from "../models/WishList";

const getAllById = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const user: any = await getUserByID(user_id);
  const list = await user.getWishlistProducts();
  res.send(list);
};

const addWishlist = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const { product_id } = req.body;
  const product = await getWishlistByIds(product_id, user_id);
  if (product) return res.status(400).send("product already exists");
  const list = await createWishlist(user_id, product_id);
  res.send(list);
};

const removeById = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const product_id = req.params.id;
  const list = await deleteWishlistByProduct(user_id, parseInt(product_id));
  if (list > 0) return res.send("removed successfully");
  return res.send("no changes made");
};
const removeAll = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const list = await deleteWishlistByUser(user_id);
  if (list > 0) return res.send("removed successfully");
  if (list === 0) {
    return res.send("No Products to Remove");
  }
};

export const wishlistController = {
  getAllById,
  addWishlist,
  removeAll,
  removeById,
};
