import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const validateWishlist = (req: Request, res: Response, next: NextFunction) => {
  const wishlist = {
    user_id: req.body.tokenPayload.user_id,
    product_id: req.body.product_id,
  };
  const scheme = Joi.object({
    user_id: Joi.number().integer().required(),
    product_id: Joi.number().integer().required(),
  });
  const { error } = scheme.validate(wishlist);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }
  next();
};
