import { Router, Response, Request } from 'express';
import { OrderItems } from '../models/Order_items';
import auth from '../middleware/auth';
import admin from '../middleware/admin';

import { Product, validateProduct } from '../models/Products';
export const router: Router = Router();

//Post a product by admin
router.post('/product/post', [auth, admin], async (req: Request, res: Response) => {
  const { product_name, description, unit_price, number_in_stock } = req.body;
  const { error } = validateProduct({ product_name, description, unit_price, number_in_stock });
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const product = await Product.create({ product_name, description, unit_price, number_in_stock });
  res.send(product);
});
//Delete Product by admin
router.delete('/product/destroy/:id', [auth, admin], async (req: Request, res: Response) => {
  const { id } = req.params;
  const order_item = await OrderItems.findOne({ where: { product_id: id } });
  if (order_item) {
    res.send('cannot delete the order Item ');
  } else {
    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).send('no such product');
    } else {
      await product?.destroy();
      res.send(product);
    }
  }
});
//update product by admin
router.patch('/product/update/:id', [auth, admin], async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);
  if (!product) {
    res.send('No product available');
  } else {
    const result = await product.update(req.body);
    res.send(result);
  }
});
//get all Products
router.get('/products', auth, async (req: Request, res: Response) => {
  const products = await Product.findAll();
  res.send(products);
});
//get product by product Id

router.get('/product/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);
  res.send(product);
});
