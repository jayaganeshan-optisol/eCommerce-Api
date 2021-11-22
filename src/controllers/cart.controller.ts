import { Router, Request, Response } from "express";
import { exist } from "joi";
import { forEach } from "lodash";
import { Op } from "sequelize";
import { Cart } from "../models/Cart";
import { Product } from "../models/Products";
import { User } from "../models/User";
//creation
const createCart = async (req: Request, res: Response) => {
  const { product_id, quantity } = req.body;
  const { user_id } = req.body.tokenPayload;
  const exists = await Cart.findOne({ where: { user_id, product_id } });
  if (exists) {
    await exists.update({ quantity });
    res.send("quantity Updated");
  }
  const cart = await Cart.create({ user_id, product_id, quantity });
  res.send(cart);
};

const getCart = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;

  const user: any = await User.findOne({ where: { user_id } });
  const bag = await user.getCartProducts();
  bag.forEach((b: any) => console.log(b.product_name, b.product_id, b.cart.quantity));
  res.send(bag);
};

const updateCart = async (req: Request, res: Response) => {
  const { product_id, quantity } = req.body;
  const { user_id } = req.body.tokenPayload;
  const cart = await Cart.findOne({ where: { user_id } });
  if (cart) {
    cart.update({ quantity }, { where: { product_id } });
    await cart.save();
    res.status(200).send("updated successfully");
  } else {
    res.status(400).send("wrong details");
  }
};

const deleteProductById = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const product_id = req.params.id;
  const cart = await Cart.findOne({ where: { [Op.and]: [{ user_id }, { product_id }] } });

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
  const cart = await Cart.destroy({ where: { user_id } });
  if (cart > 0) return res.send("Removed successfully");
};

export const cartController = {
  createCart,
  getCart,
  updateCart,
  deleteProductById,
  deleteAll,
};
