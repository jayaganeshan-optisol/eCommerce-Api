import { Model, DataTypes } from "sequelize";
import { db } from "../services/db";

export interface IOrderItems {
  product_id: number;
  order_id: number;
  quantity: number;
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
    modelName: "order_item",
  }
);
