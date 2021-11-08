import { Model, DataTypes } from 'sequelize';
import { db } from '../config/db';

export class OrderItems extends Model {
  public product_id!: number;
  public order_id!: number;
  public quantity!: number;
  public unit_price!: number;
}

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
    unit_price: {
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
