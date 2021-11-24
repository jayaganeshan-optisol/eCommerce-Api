import { WishList } from "../models/WishList";

export const getWishlistByIds = async (user_id: number, product_id: number) => {
  const result = await WishList.findOne({ where: { product_id, user_id } });
  return result;
};

export const createWishlist = async (user_id: number, product_id: number) => {
  const result = await WishList.create({ user_id, product_id });
  return result;
};

export const deleteWishlistByProduct = async (user_id: number, product_id: number) => {
  const result = await WishList.destroy({ where: { user_id, product_id } });
  return result;
};

export const deleteWishlistByUser = async (user_id: number) => {
  const result = await WishList.destroy({ where: { user_id } });
  return result;
};
