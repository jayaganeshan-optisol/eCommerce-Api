import Joi from 'joi';
import { Model, DataTypes } from 'sequelize';
import { db } from '../config/db';

export interface IOrderItems {
  product_id: number;
  order_id: string;
  quantity: string;
}
export class OrderItems extends Model<IOrderItems> {}

OrderItems.init(
  {
    product_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'order_item',
    timestamps: false,
  }
);

export const validateOrderItems = (orderItems: object): { error: Joi.ValidationError | undefined } => {
  const schema = Joi.object({
    product_id: Joi.number().required(),
    order_id: Joi.number().required(),
    quantity: Joi.number().required(),
  });
  const { error } = schema.validate(orderItems);
  if (error) {
    return { error };
  } else {
    return {
      error: undefined,
    };
  }
};
