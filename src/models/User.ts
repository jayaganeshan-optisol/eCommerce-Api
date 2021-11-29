import { Model, DataTypes, Optional } from "sequelize";
import { db } from "../services/db";
import { Order } from "./Orders";
import { Product } from "../models/Products";
import { Cart } from "./Cart";
import { WishList } from "./WishList";
import { hashPassword } from "../services/passwordHandling";
export enum AccountType {
  admin,
  seller,
  buyer,
  both,
}
interface IUser {
  user_id: number;
  name: string;
  email: string;
  password: string;
  role: AccountType;
  shipping_address: string;
}
interface IUserAttributes extends Optional<IUser, "user_id"> {}
export class User extends Model<IUser, IUserAttributes> {}

User.init(
  {
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 55],
          msg: "string length not in range",
        },
      },
    },
    role: {
      type: DataTypes.ENUM,
      values: ["admin", "seller", "buyer", "both"],
      defaultValue: "buyer",
    },
    shipping_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: "user",
  }
);

User.beforeCreate(async (user: any, options) => {
  const hashedPassword = hashPassword(user.password);
  user.password = hashedPassword;
});

User.hasMany(Order, { foreignKey: "user_id" });

User.belongsToMany(Product, { through: Cart, foreignKey: "user_id", as: "CartProducts" });
Product.belongsToMany(User, {
  through: Cart,
  foreignKey: "product_id",
  as: "CartProducts",
});

User.belongsToMany(Product, { through: WishList, as: "WishlistProducts", foreignKey: "user_id" });
Product.belongsToMany(User, { through: WishList, as: "WishlistProducts", foreignKey: "product_id" });
