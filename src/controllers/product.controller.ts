import { Response, Request } from "express";
import { getOrderItemsByProductId } from "../dao/orderItems.dao";
import { createProduct, getAllProducts, getProductById } from "../dao/products.dao";
import { getUserByID } from "../dao/user.dao.";

const addProduct = async (req: Request, res: Response) => {
  const { user_id } = req.body.tokenPayload;
  const user: any = await getUserByID(user_id);
  const { product_name, description, unit_price, number_in_stock } = req.body;
  const product = await createProduct(product_name, description, unit_price, number_in_stock, user.name);
  res.send(product);
};

const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user_id } = req.body.tokenPayload;
  const user: any = await getUserByID(user_id);
  const order_item = await getOrderItemsByProductId(parseInt(id));
  if (order_item) {
    res.send("cannot delete the product of Order Item ");
  } else {
    const product: any = await getProductById(parseInt(id));
    if (!product) {
      res.status(404).send("no such product");
    } else {
      if (product.seller_name !== user.name) res.status(400).send({ error: "Invalid seller " });
      await product?.destroy();
      res.send({ message: "Product Removed Successfully" });
    }
  }
};
const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await getProductById(parseInt(id));
  if (!product) {
    res.send("No product available");
  } else {
    const result = await product.update(req.body);
    res.send(result);
  }
};
const findAllProduct = async (req: Request, res: Response) => {
  const products = await getAllProducts();
  res.send(products);
};
const findProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await getProductById(parseInt(id));
  if (product) return res.send(product);
  return res.status(404).send({ error: "No such Product" });
};
export const productController = {
  addProduct,
  deleteProduct,
  updateProduct,
  findAllProduct,
  findProductById,
};
