import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validateParamsId = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params;
  console.log(id);
  const schema = Joi.object({
    id: Joi.number().integer().required(),
  });
  const { error } = schema.validate(id);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }
  next();
};
