import { Response, Request } from "express";
import { db } from "../config/db";
import { createOrderItems, getOrderItemsById } from "../dao/orderItems.dao";
import { getAllOrders, placeOrder, cancelOrder, getOrderById } from "../dao/orders.dao.";
import { getProductById, changeStockInProduct } from "../dao/products.dao";
import { getUserByID } from "../dao/user.dao.";
import { calcDate } from "../models/Orders";
//Creating Order
const createOrder = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const { product } = req.body;
  const t = await db.transaction();
  const user: any = await getUserByID(user_id);
  if (!user) return res.status(404).send("No user found");
  if (user.shipping_address === null) return res.status(400).send("No shipping Address");

  let products = [];
  let errorProduct;

  for (let i = 0; i < product.length; i++) {
    const result: any = await getProductById(product[i].product_id);
    if (!result) {
      errorProduct = "product id " + product[i].product_id + " not found";
    }
    if (result.number_in_stock < product[i].quantity) {
      errorProduct = "product id " + product[i].product_id + " don't have enough stock";
      break;
    }
    products.push(result);
  }
  if (errorProduct) return { status: 404, message: errorProduct };

  const order: any = await placeOrder({ user_id: user_id, date: calcDate() }, t);

  for (let i = 0; i < product.length; i++) {
    await changeStockInProduct({ quantity: product[i].quantity, product_id: product[i].product_id }, "dec", t);
    await createOrderItems({ product_id: product[i].product_id, order_id: order.order_id, quantity: product[i].quantity }, t);
  }
  await t.commit();
  return res.status(200).send(order);
};
//getting all Orders by admin
const ordersByUser = async (req: Request, res: Response) => {
  const result = await getAllOrders();
  res.status(200).send(result);
};
//Cancelling Order
const deleteOrder = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const { id: order_id } = req.params;
  const t = await db.transaction();
  const orderItems = await getOrderItemsById(parseInt(order_id));
  if (orderItems.length == 0) return res.status(404).send("No Orders");
  else {
    orderItems.forEach(async (orderItem: any) => {
      await changeStockInProduct({ quantity: orderItem.quantity, product_id: orderItem.product_id }, "inc", t);
    });
    const order = await getOrderById(parseInt(order_id));
    if (!order) {
      return res.status(404).send("No Orders");
    } else {
      await order?.destroy({ transaction: t });
      await t.commit();
      return res.status(200).send("Order Cancelled");
    }
  }
};
//Order directly form cart
const orderCart = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const user: any = await getUserByID(user_id);
  const cart = await user.getCartProducts();
  let product: any = [];
  cart.forEach((prod: any) => {
    const temp = { product_id: prod.product_id, quantity: prod.cart.quantity };
    product.push(temp);
  });
  if (product.length === 0) return res.status(400).send("No products in cart");
  const t = await db.transaction();
  if (!user) return res.status(404).send("No user found");
  if (user.shipping_address === null) return res.status(400).send("No shipping Address");

  let products = [];
  let errorProduct;

  for (let i = 0; i < product.length; i++) {
    const result: any = await getProductById(product[i].product_id);
    if (!result) {
      errorProduct = "product id " + product[i].product_id + " not found";
    }
    if (result.number_in_stock < product[i].quantity) {
      errorProduct = "product id " + product[i].product_id + " don't have enough stock";
      break;
    }
    products.push(result);
  }
  if (errorProduct) return res.status(400).send({ error: errorProduct });
  const order: any = await placeOrder({ user_id: user_id, date: calcDate() }, t);

  for (let i = 0; i < product.length; i++) {
    await changeStockInProduct({ quantity: product[i].quantity, product_id: product[i].product_id }, "dec", t);
    await createOrderItems({ product_id: product[i].product_id, order_id: order.order_id, quantity: product[i].quantity }, t);
  }
  await t.commit();
  res.status(200).send(order);
};
export const orderController = { createOrder, ordersByUser, deleteOrder, orderCart };
