import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const validateOrder = (req: Request, res: Response, next: NextFunction) => {
  const product = req.body.product;

  let errorMessage;
  product.forEach((p: object) => {
    const schema = Joi.object({
      product_id: Joi.number().integer().strict().required(),
      quantity: Joi.number().integer().strict().required(),
    });
    const { error } = schema.validate(p);
    if (error) {
      errorMessage = { error: error.details[0].message };
    }
  });
  if (errorMessage) return res.status(400).send(errorMessage);
  next();
};
