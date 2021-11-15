import express, { Application } from 'express';
import { db } from './config/db';
import { router as authRouter } from './routes/user';
import { router as orderRouter } from './routes/orders';
import { router as productRouter } from './routes/product';
import { router as cartRouter } from './routes/cart';
import { router as ListRouter } from './routes/wishlist';
import cors from 'cors';

import { config } from 'dotenv';

const app: Application = express();
const PORT = 3000;

app.listen(PORT, (): void => {
  console.log(`Running on Port ${PORT}`);
});
config();
app.use(express.json());
app.use(cors());
app.use(authRouter);
app.use(orderRouter);
app.use(productRouter);
app.use('/cart', cartRouter);
app.use('/wishlist', ListRouter);
db.authenticate().then(() => console.log('connected to DB'));
