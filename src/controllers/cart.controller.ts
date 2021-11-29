import { Request, Response } from "express";
import { createCart, deleteCartByUserId, getProductFromCart } from "../dao/carts.dao";
import { getProductById } from "../dao/products.dao";
import { getUserByID } from "../dao/user.dao.";

// Adding Products to cart of the User
const addCart = async (req: Request, res: Response) => {
  const { product_id, quantity } = req.body;
  const { user_id } = req.body.tokenPayload;
  const exists = await getProductFromCart(user_id, product_id);
  if (exists) {
    await exists.update({ quantity });
    return res.send({ message: "Updated successfully" });
  }
  const product = await getProductById(product_id);
  if (!product) return res.status(404).send({ error: "No product available" });
  const cart = await createCart(user_id, product_id, quantity);
  return res.send(cart);
};
// Getting Cart of the User
const getCart = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const user: any = await getUserByID(user_id);
  const bag = await user.getCartProducts();
  const products: any = [];
  bag.forEach((product: any) => {
    const temp = { product_id: product.product_id, product_name: product.product_name, description: product.description, unit_price: product.unit_price, quantity: product.cart.quantity };
    products.push(temp);
  });
  res.send(products);
};
// Updating the Product in the Cart by user
const updateCart = async (req: Request, res: Response) => {
  const { product_id, quantity } = req.body;
  const { user_id } = req.body.tokenPayload;
  const cart = await getProductFromCart(user_id, product_id);
  if (cart) {
    cart.update({ quantity });
    await cart.save();
    res.status(200).send({ message: "Updated successfully" });
  } else {
    res.status(404).send({ error: "No product available" });
  }
};
// Deleting a Product in Cart
const deleteProductById = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const product_id = req.params.id;
  const cart = await getProductFromCart(user_id, parseInt(product_id));

  if (cart) {
    cart.destroy();
    await cart?.save();
    return res.send({ message: "Product removed successfully" });
  } else {
    return res.status(404).send({ error: "No product Available" });
  }
};
// Deleting All Products in Cart
const deleteAll = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const cart = await deleteCartByUserId(user_id);
  if (cart > 0) return res.send({ message: "Removed successfully" });
  return res.status(400).send({ error: "No Products to Remove" });
};

export const cartController = {
  addCart,
  getCart,
  updateCart,
  deleteProductById,
  deleteAll,
};
