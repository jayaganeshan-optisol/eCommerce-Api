import { Router } from 'express';
import { wishlistController } from '../controllers/wishlist.controller';

export const router = Router();
import auth from '../middleware/auth';

//get all products in wishlist by user
router.get('/', auth, wishlistController.getAllById);

//add product to wishlist
router.post('/add', auth, wishlistController.add);
//remove a product from wishlist
router.delete('/remove', auth, wishlistController.removeById);
//remove all products from wishlist

router.delete('/remove/all', auth, wishlistController.removeAll);
