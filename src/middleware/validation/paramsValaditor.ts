import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validateParamsId = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params;
  const schema = Joi.object({
    id: Joi.number().integer().required(),
  });
  const { error } = schema.validate(id);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }
  next();
};

export const validateOrderIdToken = (req: Request, res: Response, next: NextFunction) => {
  const order_id = parseInt(req.params.order_id);
  const token = req.params.token;
  console.log(order_id, token);
  const schema = Joi.object({
    order_id: Joi.number().integer().required(),
    token: Joi.string().required(),
  });
  const { error } = schema.validate({ order_id: order_id, token });
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }
  next();
};
