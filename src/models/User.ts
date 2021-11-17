import { Model, DataTypes, Optional } from 'sequelize';
import { db } from '../config/db';
import { Order } from './Orders';
import { Product } from '../models/Products';
import { Cart } from './Cart';
import { WishList } from './WishList';
import Joi, { object } from 'joi';
interface IUser {
  user_id: number;
  name: string;
  email: string;
  password: string;
  is_premium: boolean;
  is_admin: boolean;
  shipping_address: string;
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
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 55],
          msg: 'string length not in range',
        },
      },
    },
    is_premium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    shipping_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: 'user',
    timestamps: false,
  }
);
User.hasMany(Order, { foreignKey: 'user_id' });

User.belongsToMany(Product, { through: Cart, foreignKey: 'user_id', as: 'bag' });
Product.belongsToMany(User, { through: Cart, foreignKey: 'product_id', as: 'bag' });

User.belongsToMany(Product, { through: WishList, foreignKey: 'user_id' });
Product.belongsToMany(User, { through: WishList, foreignKey: 'product_id' });
//Joi validation
export const validateUser = (user: object): { error: Joi.ValidationError | undefined } => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(45).required(),
    email: Joi.string().min(8).max(45).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')),
  });
  const { error } = schema.validate(user);
  if (error) {
    return { error };
  } else {
    return {
      error: undefined,
    };
  }
};
