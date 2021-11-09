import { Router, Response, Request } from 'express';

import { Product } from '../models/Products';
export const router: Router = Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/product/post', [auth, admin], async (req: Request, res: Response) => {
  try {
    const product = await Product.create({ name: req.body.name, description: req.body.desc, unit_price: req.body.price, number_in_stock: req.body.number_in_stock });
    res.send(product);
  } catch (er) {
    res.send(er);
  }
});

router.post('/product/destroy', [auth, admin], async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(1);
    if (!product) {
      res.status(404).send('no such product');
    } else {
      await product?.destroy();
      res.send(product);
    }
  } catch (er) {
    res.send(er);
  }
});

router.get('/products', auth, async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll();
    res.send(products);
  } catch (er) {
    res.status(500).send(er);
  }
});
