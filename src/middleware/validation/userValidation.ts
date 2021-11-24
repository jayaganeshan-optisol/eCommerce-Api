import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const password = new RegExp("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$");
export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(45).required(),
    email: Joi.string().min(8).max(45).required(),
    password: Joi.string().pattern(password).required().messages({ "string.pattern.base": "Password constrain failed" }),
    role: Joi.string().valid("seller", "buyer", "both", "admin").optional(),
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
    password: Joi.string().pattern(password).required().messages({ "string.pattern.base": "Password Constrain failed" }),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).send({ error: error.details[0].message });
  } else next();
};
//Changing password validation
export const ValidateChangePassword = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    oldPassword: Joi.string().pattern(password).required().messages({ "string.pattern.base": "Enter valid Old Password" }),
    newPassword: Joi.string().pattern(password).required().messages({ "string.pattern.base": "Enter valid New Password" }),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).send({ error: error.details[0].message });
  } else next();
};

//validate shipping Address

export const ValidateShippingAddress = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    shipping_address: Joi.string().min(10).max(255).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).send({ error: error.details[0].message });
  } else next();
};
