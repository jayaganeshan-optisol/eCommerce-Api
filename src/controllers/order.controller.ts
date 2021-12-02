import { Response, Request } from "express";
import { db } from "../services/db";
import { createOrderItems, getOrderItemsById } from "../dao/orderItems.dao";
import { getAllOrders, placeOrder, cancelOrder, getOrderById, getProductsInOrder, getProductsInOrderItems, getOrderByUserIdOrderId } from "../dao/orders.dao.";
import { getProductById, changeStockInProduct } from "../dao/products.dao";
import { getUserByID } from "../dao/user.dao.";
import { calcDate } from "../models/Orders";
import { stripe } from "../app";
import { Payment } from "../models/Payment";

//Creating Order by buyer or both
const createOrder = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const { product } = req.body;
  const t = await db.transaction();
  const user: any = await getUserByID(user_id);
  if (!user) return res.status(404).send({ error: "No user found" });
  if (user.shipping_address === null) return res.status(400).send({ error: "No shipping Address" });

  let products = [];
  let errorProduct;

  for (let i = 0; i < product.length; i++) {
    const result: any = await getProductById(product[i].product_id);
    if (!result) {
      errorProduct = "product id " + product[i].product_id + " not found";
      break;
    }
    if (result.number_in_stock < product[i].quantity) {
      errorProduct = "product id " + product[i].product_id + " don't have enough stock";
      break;
    }
    products.push(result);
  }
  if (errorProduct) return res.status(404).send({ error: errorProduct });

  const order: any = await placeOrder({ user_id: user_id, date: calcDate() }, t);

  for (let i = 0; i < product.length; i++) {
    await changeStockInProduct({ quantity: product[i].quantity, product_id: product[i].product_id }, "dec", t);
    await createOrderItems({ product_id: product[i].product_id, order_id: order.order_id, quantity: product[i].quantity }, t);
  }
  await t.commit();
  return res.status(200).send({
    message: "Order Placed Successfully",
    order_id: order.order_id,
  });
};
//getting all Orders by admin
const ordersByUser = async (req: Request, res: Response) => {
  const result = await getAllOrders();
  res.status(200).send(result);
};
//Cancelling Order by buyer or both
const deleteOrder = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const { id: order_id } = req.params;
  const t = await db.transaction();
  const orderItems = await getOrderItemsById(parseInt(order_id));
  if (orderItems.length == 0) return res.status(404).send({ error: "No Orders" });
  else {
    orderItems.forEach(async (orderItem: any) => {
      await changeStockInProduct({ quantity: orderItem.quantity, product_id: orderItem.product_id }, "inc", t);
    });
    const order: any = await getOrderById(parseInt(order_id));
    if (!order) {
      return res.status(404).send("No Orders");
    } else {
      if (user_id !== order.user_id) return res.status(400).send({ error: "No orders to cancel" });
      await order?.destroy({ transaction: t });
      await t.commit();
      return res.status(200).send({ message: "Order Cancelled" });
    }
  }
};
//Order directly form cart of user
const orderCart = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const user: any = await getUserByID(user_id);
  if (!user) return res.status(404).send({ error: "No user found" });
  const cart = await user.getCartProducts();
  let product: any = [];
  cart.forEach((prod: any) => {
    const temp = { product_id: prod.product_id, quantity: prod.cart.quantity };
    product.push(temp);
  });
  if (product.length === 0) return res.status(400).send({ error: "No products in cart" });
  const t = await db.transaction();
  if (user.shipping_address === null) return res.status(400).send({ error: "No shipping Address" });

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
  res.status(200).send({ message: "Order Placed Successfully" });
};

const findOrderByUser = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const orders: any = await getProductsInOrder(user_id);
  let result: any = [];
  orders.forEach((order: any) => {
    let sum: number = 0;
    order.products.forEach((product: any) => {
      const temp = product.unit_price * product.order_item.quantity;
      sum = sum + temp;
    });
    const orderDetails = { order_id: order.order_id, date: order.date, total_price: sum };
    result.push(orderDetails);
  });
  res.send(result);
};

const findOrderItemsByUser = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const { id } = req.params;
  const order: any = await getProductsInOrderItems(parseInt(id), user_id);
  const orderItems: any = [];
  order.products.forEach((product: any) => {
    const temp = { product_id: product.product_id, product_name: product.product_id, quantity: product.order_item.quantity, unit_price: product.unit_price };
    orderItems.push(temp);
  });
  res.send(orderItems);
};

const payment = async (req: Request, res: Response) => {
  const { user_id, stripe_id } = req.body.tokenPayload;
  const order_id = parseInt(req.params.order_id);
  const { card } = req.body;
  const order: any = await getOrderByUserIdOrderId(user_id, order_id);
  const paymentDetails = await Payment.findOne({ where: { user_id, order_id } });
  if (paymentDetails) return res.send({ error: "Payment already made" });
  let sum: number = 0;
  order.products.forEach((product: any) => {
    const temp = product.unit_price * product.order_item.quantity;
    sum = sum + temp;
  });
  const orderDetails = { order_id: order.order_id, date: order.date, total_price: sum };
  //stripe
  const token: any = await stripe.tokens.create({ card });
  await stripe.customers.createSource(stripe_id, {
    source: token.id,
  });
  const { id, paid } = await stripe.charges.create({
    amount: orderDetails.total_price,
    currency: "inr",
    customer: stripe_id,
  });
  console.log(id, paid);
  const paymentInfo = await Payment.create({ user_id, order_id, payment_date: order.date, payment_id: id, payment_status: paid });
  res.send({ message: `Payment successful with paymentID card_1K1vc0SIoB4FwKhua5TLZi0t` });
};
export const orderController = { createOrder, ordersByUser, deleteOrder, orderCart, findOrderByUser, findOrderItemsByUser, payment };
