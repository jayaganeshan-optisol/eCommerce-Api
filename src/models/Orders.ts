import { Model, DataTypes, Optional } from "sequelize";
import { db } from "../config/db";
import { OrderItems } from "./Order_items";
import { Product } from "./Products";

export interface IOrder {
  user_id: number;
  order_id: number;
  date: string;
}
export interface IOrderAttributes extends Optional<IOrder, "order_id"> {}
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
    modelName: "order",
  }
);
Order.belongsToMany(Product, { through: OrderItems, foreignKey: "order_id" });
Product.belongsToMany(Order, { through: OrderItems, foreignKey: "product_id" });

export const calcDate = () => {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};
