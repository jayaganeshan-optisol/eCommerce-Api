import Joi, { string } from 'joi';
import { Model, DataTypes, Optional } from 'sequelize';
import { db } from '../config/db';
import { OrderItems } from './Order_items';
import { Product } from './Products';

interface IOrder {
  user_id: number;
  order_id: number;
  date: string;
}
interface IOrderAttributes extends Optional<IOrder, 'order_id'> {}
export class Order extends Model<IOrder, IOrderAttributes> {}

Order.init(
  {
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'order',
    timestamps: false,
  }
);
Order.belongsToMany(Product, { through: OrderItems, foreignKey: 'order_id' });
Product.belongsToMany(Order, { through: OrderItems, foreignKey: 'product_id' });

export const calcDate = () => {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

export const validateOrder = (order: object): { error: Joi.ValidationError | undefined } => {
  const schema = Joi.object({
    user_id: Joi.number().required(),
    date: Joi.string().pattern(new RegExp('((?:19|20)\\d\\d)-(0?[1-9]|1[012])-([12][0-9]|3[01]|0?[1-9])')),
  });
  const { error } = schema.validate(order);
  if (error) {
    return { error };
  } else {
    return { error: undefined };
  }
};
