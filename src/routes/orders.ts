import { Router, Response, Request } from 'express';
import { db } from '../config/db';
import { calcDate, Order, validateOrder } from '../models/Orders';
import { OrderItems, validateOrderItems } from '../models/Order_items';
import { Product } from '../models/Products';
import { User } from '../models/User';
import auth from '../middleware/auth';
import admin from '../middleware/admin';
import { Op } from 'sequelize';

export const router: Router = Router();
//create order by user
router.post('/order', auth, async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body.tokenPayload;
    const { product } = req.body;
    const user: any = await User.findByPk(user_id);

    const t = await db.transaction();
    const { error } = validateOrder({ user_id: user.user_id, date: calcDate() });
    console.log(calcDate());
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const order: any = await Order.create({ user_id: user.user_id, date: calcDate() }, { transaction: t });

    for (let i = 0; i < product.length; i++) {
      let result: any = await Product.findOne({ where: { [Op.and]: [{ product_id: product[i].product_id }, { number_in_stock: { [Op.gte]: product[i].quantity } }] } });
      if (!result) {
        const prod: any = await Product.findByPk(product[i].product_id);
        await t.rollback();
        return res.status(200).send(`${prod.product_name} out of stock`);
      } else {
        const { error } = validateOrderItems({ product_id: result.product_id, order_id: order.order_id, quantity: product[i].quantity });
        if (error) {
          return res.status(400).send(error.details[0].message);
        }
        await OrderItems.create({ product_id: result.product_id, order_id: order.order_id, quantity: product[i].quantity }, { transaction: t });
        result.decrement({ number_in_stock: product[i].quantity }, { where: { product_id: product[i].product_id } });
        await result.save();
      }
    }
    await t.commit();
    res.send(order);
  } catch (er) {
    res.send(er);
  }
});
//find orders by User
router.get('/orders/all', [auth, admin], async (req: any, res: Response) => {
  const order_items = await User.findAll({ include: { model: Order } });
  res.send(order_items);
});

//delete Order
router.delete('/orders/:id', async (req: Request, res: Response) => {
  const t = await db.transaction();
  const orderItems = await OrderItems.findAll({ where: { order_id: req.params.id } });
  if (orderItems.length == 0) {
    res.send('no orders');
  } else {
    orderItems.forEach(async (order: any) => {
      await Product.increment({ number_in_stock: order.quantity }, { where: { product_id: order.product_id } });
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
});
