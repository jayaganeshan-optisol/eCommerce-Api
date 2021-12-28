import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const validateCart = (req: Request, res: Response, next: NextFunction) => {
  const cart = {
    user_id: req.body.tokenPayload.user_id,
    product_id: req.body.product_id,
    quantity: req.body.quantity,
  };
  const scheme = Joi.object({
    user_id: Joi.number().integer().required(),
    product_id: Joi.number().integer().required(),
    quantity: Joi.number().integer().required(),
  });
  const { error } = scheme.validate(cart);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }
  next();
};
