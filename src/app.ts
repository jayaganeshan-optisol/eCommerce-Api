import express, { Application } from 'express';
import { db } from './config/db';
import { router as authRouter } from './routes/auth';
import { router as orderRouter } from './routes/orders';
import { router as productRouter } from './routes/product';
const cors = require('cors');

import { config } from 'dotenv';

const app: Application = express();
const PORT = 3000;

app.listen(PORT, (): void => {
  console.log(`Running on Port ${PORT}`);
});
config();
app.use(express.json());
app.use(authRouter);
app.use(orderRouter);
app.use(productRouter);
app.use(cors());
db.authenticate().then(() => console.log('connected to db'));
