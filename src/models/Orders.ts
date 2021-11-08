import { Model, DataTypes } from 'sequelize';
import { db } from '../config/db';
import { Product } from './Products';

export class Order extends Model {
  public user_id!: number;
  public order_id!: number;
  public date!: string;
  public shipping_address!: string;
}

Order.init(
  {
    user_id: {
      type: DataTypes.UUIDV4,
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
      type: DataTypes.DATE,
      allowNull: false,
    },
    shipping_address: {
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
