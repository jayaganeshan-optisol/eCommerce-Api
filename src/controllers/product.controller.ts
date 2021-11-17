import { Router, Response, Request } from 'express';
import { OrderItems } from '../models/Order_items';
import { Product, validateProduct } from '../models/Products';

const createProduct = async (req: Request, res: Response) => {
  const { product_name, description, unit_price, number_in_stock } = req.body;
  const { error } = validateProduct({ product_name, description, unit_price, number_in_stock });
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const product = await Product.create({ product_name, description, unit_price, number_in_stock });
  res.send(product);
};

const deleteProduct = async (req: Request, res: Response) => {
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
};
const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);
  if (!product) {
    res.send('No product available');
  } else {
    const result = await product.update(req.body);
    res.send(result);
  }
};
const getAllProduct = async (req: Request, res: Response) => {
  const products = await Product.findAll();
  res.send(products);
};
const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);
  res.send(product);
};
export const productController = {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProduct,
  getProductById,
};
