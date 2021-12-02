import { Model, DataTypes, Optional } from "sequelize";
import { db } from "../services/db";

interface IToken {
  user_id: number;
  token: string;
}

interface ITokenAttributes extends Optional<IToken, "user_id"> {}
export class Token extends Model<IToken, ITokenAttributes> {}

Token.init(
  {
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      allowNull: false,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "forgotPassword",
  }
);
