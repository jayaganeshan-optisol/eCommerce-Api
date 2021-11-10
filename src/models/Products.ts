import { Model, DataTypes, Optional } from 'sequelize';
import { db } from '../config/db';
import { User } from './User';

export interface IProduct {
  product_id: number;
  name: string;
  description: string;
  unit_price: number;
  number_in_stock: number;
}
interface IProductsAttributes extends Optional<IProduct, 'product_id'> {}
export class Product extends Model<IProduct, IProductsAttributes> {}

Product.init(
  {
    product_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
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
  },
  {
    sequelize: db,
    modelName: 'product',
    timestamps: false,
  }
);
// Product.belongsToMany(User, { through: 'cart' });
