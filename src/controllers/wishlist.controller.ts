import { Request, Response } from "express";
import { getProductById } from "../dao/products.dao";
import { getUserByID } from "../dao/user.dao.";
import { createWishlist, deleteWishlistByProduct, deleteWishlistByUser, getWishlistByIds } from "../dao/wishlist.dao";
// Getting all all products in wishList using User ID
const getAllById = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const user: any = await getUserByID(user_id);
  const list = await user.getWishlistProducts();
  let products: any = [];
  list.forEach((product: any) => {
    const temp = { product_id: product.product_id, product_name: product.product_name, description: product.description, unit_price: product.unit_price };
    products.push(temp);
  });
  res.send(products);
};
// Adding Product to wishlist
const addWishlist = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const { product_id } = req.body;
  const wishlist = await getWishlistByIds(user_id, product_id);
  if (wishlist) return res.status(400).send({ error: "product already exists" });
  const product = await getProductById(product_id);
  if (!product) {
    return res.status(404).send({ error: "No such product available" });
  }
  const list = await createWishlist(user_id, product_id);
  res.send(list);
};
//Removing single Product from wishlist by product ID
const removeById = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const product_id = req.params.id;
  const list = await deleteWishlistByProduct(user_id, parseInt(product_id));
  if (list > 0) return res.send({ message: "Removed successfully" });
  return res.send({ message: "no changes made" });
};
// Removing all Product from wishlist by User ID
const removeAll = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const list = await deleteWishlistByUser(user_id);
  if (list > 0) return res.send({ message: "Removed successfully" });
  if (list === 0) {
    return res.send({ message: "No Product to Remove" });
  }
};

export const wishlistController = {
  getAllById,
  addWishlist,
  removeAll,
  removeById,
};
