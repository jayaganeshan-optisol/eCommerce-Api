import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const validateProduct = (req: Request, res: Response, next: NextFunction) => {
  const product = {
    product_name: req.body.product_name,
    description: req.body.description,
    unit_price: req.body.unit_price,
    number_in_stock: req.body.number_in_stock,
  };
  const schema = Joi.object({
    product_name: Joi.string().required(),
    description: Joi.string().required(),
    unit_price: Joi.number().integer().strict().required(),
    number_in_stock: Joi.number().integer().strict().required(),
  });
  const { error } = schema.validate(product);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }
  next();
};

//Validate Product Update
export const validateProductUpdate = (req: Request, res: Response, next: NextFunction) => {
  const product = {
    product_name: req.body.product_name,
    description: req.body.description,
    unit_price: req.body.unit_price,
    number_in_stock: req.body.number_in_stock,
  };
  const schema = Joi.object({
    product_name: Joi.string().optional(),
    description: Joi.string().optional(),
    unit_price: Joi.number().integer().strict().optional(),
    number_in_stock: Joi.number().integer().strict().optional(),
  });
  const { error } = schema.validate(product);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }
  next();
};
