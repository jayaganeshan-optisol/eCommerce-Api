import { Response, Request } from 'express';
import { db } from '../config/db';
import { calcDate, Order } from '../models/Orders';
import { OrderItems } from '../models/Order_items';
import { Product } from '../models/Products';
import { User } from '../models/User';

const createOrder = async (req: Request, res: Response) => {
  const t = await db.transaction();
  const { user_id } = req.body.tokenPayload;
  const { product } = req.body;

  const user: any = await User.findByPk(user_id);
  if (!user) return res.status(400).send('user not found');
  if (user.shipping_address === null) return res.status(400).send('no shipping address');

  let products = [];
  let errorProduct;

  for (let i = 0; i < product.length; i++) {
    const result: any = await Product.findByPk(product[i].product_id);
    if (!result) {
      errorProduct = 'product id ' + product[i].product_id + ' not found';
    }
    if (result.number_in_stock < product[i].quantity) {
      errorProduct = 'product id ' + product[i].product_id + " don't have enough stock";
      break;
    }
    products.push(result);
  }
  if (errorProduct) return res.status(400).send(errorProduct);

  const order: any = await Order.create({ user_id: user_id, date: calcDate() }, { transaction: t });

  for (let i = 0; i < product.length; i++) {
    await Product.increment({ number_in_stock: -product[i].quantity }, { where: { product_id: product[i].product_id }, transaction: t });
    await OrderItems.create({ product_id: product[i].product_id, order_id: order.order_id, quantity: product[i].quantity }, { transaction: t });
  }
  await t.commit();
  res.send(order);
};

const ordersByUser = async (req: any, res: Response) => {
  const order_items = await User.findAll({ include: { model: Order } });
  res.send(order_items);
};

const cancelOrder = async (req: Request, res: Response) => {
  const t = await db.transaction();
  const orderItems = await OrderItems.findAll({ where: { order_id: req.params.id } });
  if (orderItems.length == 0) {
    res.send('no orders');
  } else {
    orderItems.forEach(async (order: any) => {
      await Product.increment({ number_in_stock: order.quantity }, { where: { product_id: order.product_id }, transaction: t });
      await order.destroy({ transaction: t });
    });
    const order = await Order.findOne({ where: { order_id: req.params.id } });
    if (!order) {
      res.send('no such order');
    } else {
      await order?.destroy({ transaction: t });
      await t.commit();
      res.send('order cancelled');
    }
  }
};

export const orderController = { createOrder, ordersByUser, cancelOrder };
