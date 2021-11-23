import { Request, Response } from "express";
import { createCart, deleteCartByUserId, getProductsFromCart } from "../dao/carts.dao";
import { getUserByID } from "../dao/user.dao.";
//creation
const addCart = async (req: Request, res: Response) => {
  const { product_id, quantity } = req.body;
  const { user_id } = req.body.tokenPayload;
  const exists = await getProductsFromCart(user_id, product_id);
  if (exists) {
    await exists.update({ quantity });
    return res.send("quantity Updated");
  }
  const cart = await createCart(user_id, product_id, quantity);
  return res.send(cart);
};

const getCart = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;

  const user: any = await getUserByID(user_id);
  const bag = await user.getCartProducts();
  bag.forEach((b: any) => console.log(b.product_name, b.product_id, b.cart.quantity));
  res.send(bag);
};

const updateCart = async (req: Request, res: Response) => {
  const { product_id, quantity } = req.body;
  const { user_id } = req.body.tokenPayload;
  const cart = await getProductsFromCart(user_id, product_id);
  if (cart) {
    cart.update({ quantity });
    await cart.save();
    res.status(200).send("updated successfully");
  } else {
    res.status(400).send("wrong details");
  }
};

const deleteProductById = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const product_id = req.params.id;
  const cart = await getProductsFromCart(user_id, parseInt(product_id));

  if (cart) {
    cart.destroy();
    await cart?.save();
    res.send("Product removed successfully");
  } else {
    res.status(404).send("No product Available");
  }
};

const deleteAll = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const cart = await deleteCartByUserId(user_id);
  if (cart > 0) return res.send("Removed successfully");
  return res.status(400).send("No Products to Remove");
};

export const cartController = {
  addCart,
  getCart,
  updateCart,
  deleteProductById,
  deleteAll,
};
