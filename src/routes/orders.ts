import { Router, Response, Request } from 'express';
import { db } from '../config/db';
import { Order } from '../models/Orders';
import { OrderItems } from '../models/Order_items';
import { Product } from '../models/Products';
import { User } from '../models/User';
export const router: Router = Router();
const auth = require('../middleware/auth');

router.post('/order', auth, async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const { product_id, quantity } = req.body;
  try {
    await db.transaction(async t => {
      const order: any = await Order.create({ user_id, date: '10-11-2021', shipping_address: '1/222,fakeAddress,add' }, { transaction: t });
      console.log(order.order_id);

      for (let i = 0; i < product_id.length; i++) {
        let product = await Product.findByPk(product_id[i]);
        if (product === null) {
          res.send('error');
        } else {
          const order_items: any = await OrderItems.create({ product_id: product.product_id, order_id: order.order_id, quantity, unit_price: product.unit_price }, { transaction: t });
          console.log(order_items);
        }
      }
      res.send({ order });
    });
  } catch (er) {
    console.log(er);
  }
});

router.get('/ordersbyid', auth, async (req: any, res: Response) => {
  const order_items = await User.findAll({ include: Order });
  res.send(order_items);
});
