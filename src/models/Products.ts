import { Model, DataTypes, Optional } from "sequelize";
import { db } from "../services/db";

export interface IProduct {
  product_id: number;
  product_name: string;
  description: string;
  unit_price: number;
  number_in_stock: number;
  seller_name: string;
}
interface IProductsAttributes extends Optional<IProduct, "product_id"> {}
export class Product extends Model<IProduct, IProductsAttributes> {}

Product.init(
  {
    product_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    product_name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(2000),
      allowNull: false,
    },
    unit_price: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    number_in_stock: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    seller_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "product",
  }
);
