import { Transaction } from "sequelize/types";
import { Product } from "../models/Products";

export const getProductById = async (product_id: number) => {
  const result = await Product.findByPk(product_id);
  return result;
};
export const changeStockInProduct = async (product: { quantity: number; product_id: number }, type: string, transaction: Transaction) => {
  if (type === "inc") {
    await Product.increment({ number_in_stock: product.quantity }, { where: { product_id: product.product_id }, transaction });
  }
  if (type === "dec") {
    await Product.increment({ number_in_stock: -product.quantity }, { where: { product_id: product.product_id }, transaction });
  }
};
