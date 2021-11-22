import { Sequelize } from 'sequelize';

export const db: Sequelize = new Sequelize('sql_ecommerce', 'ecommerce', 'mypassword', {
  host: 'localhost',
  dialect: 'mysql',
});
