import { NextFunction, Request, Response } from 'express';
import Joi, { object } from 'joi';

export const validateUser = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(45).required(),
    email: Joi.string().min(8).max(45).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  } else next();
};

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
    return res.send(400).send(error.details[0].message);
  }
  next();
};

// export const validateOrder = (req: Request, res: Response, next: NextFunction) => {
//   const schema = Joi.object({
//     user_id: Joi.number().integer().strict().required(),
//     date: Joi.string().pattern(new RegExp('((?:19|20)\\d\\d)-(0?[1-9]|1[012])-([12][0-9]|3[01]|0?[1-9])')),
//   });
//   const { error } = schema.validate(req.body);
//   if (error) {
//     return { error };
//   } else {
//     return { error: undefined };
//   }
// };

export const validateOrderItems = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    product_id: Joi.number().integer().strict().required(),
    order_id: Joi.number().integer().strict().required(),
    quantity: Joi.number().integer().min(1).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return { error };
  } else {
    return {
      error: undefined,
    };
  }
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
    return res.status(400).send(error.details[0].message);
  }
  next();
};

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
    return res.status(400).send(error.details[0].message);
  }
  next();
};

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
      errorMessage = error.details[0].message;
    }
  });
  if (errorMessage) return res.status(400).send(errorMessage);
  next();
};
