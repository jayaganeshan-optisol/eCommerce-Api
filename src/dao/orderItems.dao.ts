import { Transaction } from "sequelize/types";
import { IOrderItems, OrderItems } from "../models/Order_items";
//creating OrderItems
export const createOrderItems = async (orderDetails: IOrderItems, transaction: Transaction) => {
  await OrderItems.create({ product_id: orderDetails.product_id, order_id: orderDetails.order_id, quantity: orderDetails.quantity }, { transaction });
};
//find all orderItems by order_id

export const getOrderItemsById = async (order_id: number) => {
  const order_items = await OrderItems.findAll({ where: { order_id } });
  return order_items;
};

export const getOrderItemsByProductId = async (product_id: number) => {
  const order_items = await OrderItems.findOne({ where: { product_id } });
  return order_items;
};
