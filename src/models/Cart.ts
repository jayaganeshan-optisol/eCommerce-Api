import { Model, DataTypes } from "sequelize";
import { db } from "../services/db";

export class Cart extends Model {
  public cart_id!: number;
  public user_id!: number;
}
Cart.init(
  {
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 1,
    },
  },
  {
    sequelize: db,
    modelName: "cart",
  }
);
