import { Model, DataTypes } from 'sequelize';
import { db } from '../config/db';
import { Product } from './Products';

export class Order extends Model {
  public user_id!: number;
  public order_id!: number;
  public date!: string;
}

Order.init(
  {
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
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
