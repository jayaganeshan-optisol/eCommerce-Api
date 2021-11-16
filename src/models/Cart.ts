import e from 'express';
import Joi from 'joi';
import { Model, DataTypes, Optional } from 'sequelize';
import { db } from '../config/db';

export class Cart extends Model {
  public cart_id!: number;
  public user_id!: number;
}
Cart.init(
  {
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 1,
    },
  },
  {
    sequelize: db,
    modelName: 'cart',
    timestamps: false,
  }
);

export const validateCart = (cart: object): { error: Joi.ValidationError | undefined } => {
  const scheme = Joi.object({
    user_id: Joi.number().required(),
    product_id: Joi.number().required(),
    quantity: Joi.number().required(),
  });
  const { error } = scheme.validate(cart);
  if (error) {
    return { error };
  } else {
    return { error: undefined };
  }
};
