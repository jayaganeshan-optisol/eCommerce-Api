import { Cart } from "../models/Cart";

export const createCart = async (user_id: number, product_id: number, quantity: number) => {
  const result = await Cart.create({ user_id, product_id, quantity });
  return result;
};
export const getProductFromCart = async (user_id: number, product_id: number) => {
  const result = await Cart.findOne({ where: { user_id, product_id } });
  return result;
};
export const deleteCartByUserId = async (user_id: number) => {
  const result = await Cart.destroy({ where: { user_id } });
  return result;
};
