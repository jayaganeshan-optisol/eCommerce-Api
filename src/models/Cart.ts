import { Model, DataTypes } from 'sequelize';
import { db } from '../config/db';

export class Cart extends Model {
  public user_id!: number;
  public product_id!: number;
  public quantity!: number;
}
Cart.init(
  {
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 1,
    },
  },
  {
    sequelize: db,
    modelName: 'cart',
    timestamps: false,
  }
);
