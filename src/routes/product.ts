import { Router, Response, Request } from 'express';
import { db } from '../config/db';
import { OrderItems } from '../models/Order_items';
import { Product } from '../models/Products';
export const router: Router = Router();

router.post('/product/post', async (req: Request, res: Response) => {
  try {
    const product = await Product.create({ product_id: 3, name: 'null', description: 'null', unit_price: 0, number_in_stock: 1000 });
    res.send(product);
  } catch (er) {
    res.send(er);
  }
});

router.post('/product/destroy', async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(1);
    await product?.destroy();
    res.send(product);
  } catch (er) {
    res.send(er);
  }
});
