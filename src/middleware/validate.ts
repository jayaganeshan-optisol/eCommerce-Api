import { NextFunction, Request, Response } from "express";
import Joi from "joi";
//user validation
//Register Validation
const password = new RegExp("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$");
export const validateUser = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(45).required(),
    email: Joi.string().min(8).max(45).required(),
    password: Joi.string().pattern(password).required().messages({ "string.pattern.base": "Invalid Password" }),
    is_admin: Joi.boolean().optional(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).send({ error: error.details[0].message });
  } else next();
};
//Login Validation
export const ValidateLogin = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().min(8).max(45).required(),
    password: Joi.string().pattern(password).required().messages({ "string.pattern.base": "Invalid Password" }),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).send({ error: error.details[0].message });
  } else next();
};

//Product Validation
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
    return res.send(400).send({ error: error.details[0].message });
  }
  next();
};

//cart validation
export const validateCart = (req: Request, res: Response, next: NextFunction) => {
  const cart = {
    user_id: req.body.tokenPayload.user_id,
    product_id: req.body.product_id,
    quantity: req.body.quantity,
  };
  const scheme = Joi.object({
    user_id: Joi.number().integer().strict().required(),
    product_id: Joi.number().integer().strict().required(),
    quantity: Joi.number().integer().strict().required(),
  });
  const { error } = scheme.validate(cart);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }
  next();
};
//wishlist Validation
export const validateWishlist = (req: Request, res: Response, next: NextFunction) => {
  const wishlist = {
    user_id: req.body.tokenPayload.user_id,
    product_id: req.body.product_id,
  };
  const scheme = Joi.object({
    user_id: Joi.number().integer().strict().required(),
    product_id: Joi.number().integer().strict().required(),
  });
  const { error } = scheme.validate(wishlist);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }
  next();
};
//Validate Order
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
