import { Model, DataTypes } from 'sequelize';
import { db } from '../config/db';

// export interface IProducts {
//   product_id: number;
//   name: string;
//   description: string;
//   unit_price: number;
//   number_in_stock: number;
// }

export class Product extends Model {
  public product_id!: number | undefined;
  public name!: string;
  public unit_price!: number;
  public description!: string;
  public number_in_stock!: number;
}

Product.init(
  {
    product_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(45),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
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
