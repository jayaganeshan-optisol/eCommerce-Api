import { Model, DataTypes, Optional } from 'sequelize';
import { db } from '../config/db';
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
Order.belongsToMany(Product, { through: 'Order_items' });

export const calcDate = () => {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};
