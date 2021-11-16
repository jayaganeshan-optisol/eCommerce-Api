import { Model, DataTypes, Optional } from 'sequelize';
import { db } from '../config/db';
import Joi from 'joi';

export class WishList extends Model {
  public product_id!: number;
  public user_id!: number;
}
WishList.init(
  {},
  {
    sequelize: db,
    modelName: 'wishlist',
    timestamps: false,
  }
);

export const validateWishlist = (wishlist: object): { error: Joi.ValidationError | undefined } => {
  const scheme = Joi.object({
    user_id: Joi.number().required(),
    product_id: Joi.number().required(),
  });
  const { error } = scheme.validate(wishlist);
  if (error) {
    return { error };
  } else {
    return { error: undefined };
  }
};
