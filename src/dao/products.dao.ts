import { Transaction } from "sequelize/types";
import { Product } from "../models/Products";

export const createProduct = async (product_name: string, description: string, unit_price: number, number_in_stock: number, seller_name: string) => {
  const result = await Product.create({ product_name, description, unit_price, number_in_stock, seller_name });
  return result;
};
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
export const getAllProducts = async () => {
  const result = await Product.findAll();
  return result;
};
