import { Model, DataTypes, Optional } from 'sequelize';
import { db } from '../config/db';
import { Order } from '../models/Orders';

interface IUser {
  user_id: number;
  name: string;
  email: string;
  password: string;
  is_premium: boolean;
  is_admin: boolean;
}
interface IUserAttributes extends Optional<IUser, 'user_id'> {}
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
        len: {
          args: [8, 55],
          msg: 'string length not in range',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_premium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize: db,
    modelName: 'user',
    timestamps: false,
  }
);

User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });
