require('dotenv').config({ path: `.env.local` });

const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  'mydb', 
  process.env.SQL_DB_USERNAME,
  process.env.SQL_DB_PASSWORD, {
    dialect: 'mysql',
    host: process.env.HOST_NAME
  }
);

module.exports = sequelize;