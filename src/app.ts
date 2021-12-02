import express, { Application } from "express";
require("express-async-errors");
import { db } from "./services/db";
import { router as authRouter } from "./routes/user";
import { router as orderRouter } from "./routes/orders";
import { router as productRouter } from "./routes/product";
import { router as cartRouter } from "./routes/cart";
import { router as ListRouter } from "./routes/wishlist";
import error from "./middleware/error";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
const swaggerDocument = YAML.load("./swagger.yaml");
import config from "config";
import { Stripe } from "stripe";

export const stripe = new Stripe(config.get("STRIPE_SK"), {
  apiVersion: "2020-08-27",
});
const app: Application = express();
const PORT = 3000;

app.listen(PORT, (): void => {
  console.log(`Running on Port ${PORT}`);
});
app.use(express.json());
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(authRouter);
app.use("/order", orderRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/wishlist", ListRouter);
app.use(error);
db.authenticate().then(() => console.log("connected to DB"));

export default app;
