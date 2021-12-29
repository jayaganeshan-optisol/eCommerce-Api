import { Model, DataTypes, Optional } from "sequelize";
import { db } from "../services/db";
import { Order } from "./Orders";

interface IPayment {
  user_id: number;
  order_id: number;
  payment_id: string;
  payment_date: string;
  payment_status: boolean;
}

interface IPaymentAttributes extends Optional<IPayment, "user_id"> {}
export class Payment extends Model<IPayment, IPaymentAttributes> {}

Payment.init(
  {
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      allowNull: false,
    },
    payment_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payment_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    payment_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize: db,
    modelName: "payment_info",
  }
);
