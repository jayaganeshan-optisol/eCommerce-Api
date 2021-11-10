import { Router, Response, Request } from 'express';
import { db } from '../config/db';
import { calcDate, Order } from '../models/Orders';
import { OrderItems } from '../models/Order_items';
import { Product } from '../models/Products';
import { User } from '../models/User';
export const router: Router = Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
//create order by user
router.post('/order', auth, async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const { product_id, quantity } = req.body;
  const user: any = await User.findByPk(user_id);

  try {
    await db.transaction(async t => {
      const order: any = await Order.create({ user_id: user.user_id, date: calcDate() }, { transaction: t });
      for (let i = 0; i < product_id.length; i++) {
        let product: any = await Product.findByPk(product_id[i]);
        if (product === null) {
          res.send('error');
        } else {
          const order_items: any = await OrderItems.create({ product_id: product.product_id, order_id: order.order_id, quantity, unit_price: product.unit_price }, { transaction: t });
        }
      }
      res.send(order);
    });
  } catch (er) {
    res.status(500).send(er);
  }
});
//find orders by User
router.get('/orders/all', [auth, admin], async (req: any, res: Response) => {
  const order_items = await User.findAll({ include: Order });
  res.send(order_items);
});

//delete Order
router.delete('/orders/:id', async (req: Request, res: Response) => {
  try {
    await db.transaction(async t => {
      const orderItems = await OrderItems.findAll({ where: { order_id: req.params.id } });
      if (orderItems.length == 0) {
        res.send('no such order');
      } else {
        orderItems.forEach(async order => await order.destroy({ transaction: t }));
        const order = await Order.findOne({ where: { order_id: req.params.id } });
        if (!order) {
          res.send('no such order');
        } else {
          await order?.destroy({ transaction: t });
          res.send('success');
        }
      }
    });
  } catch (er) {
    res.status(500).send(er);
  }
});
