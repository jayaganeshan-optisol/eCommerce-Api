import { Response, Request } from "express";
import { OrderItems } from "../models/Order_items";
import { Product } from "../models/Products";

const createProduct = async (req: Request, res: Response) => {
  const { product_name, description, unit_price, number_in_stock } = req.body;
  const product = await Product.create({ product_name, description, unit_price, number_in_stock });
  res.send(product);
};

const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const order_item = await OrderItems.findOne({ where: { product_id: id } });
  if (order_item) {
    res.send("cannot delete the order Item ");
  } else {
    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).send("no such product");
    } else {
      const result = await product?.destroy();
      res.send({ message: "Product Removed Successfully" });
    }
  }
};
const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);
  if (!product) {
    res.send("No product available");
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
  if (product) return res.send(product);
  return res.status(404).send({ error: "No such Product" });
};
export const productController = {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProduct,
  getProductById,
};
