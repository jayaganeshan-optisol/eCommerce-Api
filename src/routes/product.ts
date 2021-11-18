import { Router } from 'express';
import auth from '../middleware/auth';
import admin from '../middleware/admin';
import { productController } from '../controllers/product.controller';
import { validateProduct } from '../middleware/validate';

export const router: Router = Router();
//Post a product by admin
router.post('/product/post', [auth, admin, validateProduct], productController.createProduct);
//Delete Product by admin
router.delete('/product/destroy/:id', [auth, admin], productController.deleteProduct);
//update product by admin
router.patch('/product/update/:id', [auth, admin], productController.updateProduct);
//get all Products
router.get('/products', auth, productController.getAllProduct);
//get product by product Id
router.get('/product/:id', productController.getProductById);
