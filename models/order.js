const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Order = sequelize.define('order', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  totalAmount: {
    type: Sequelize.DOUBLE,
    allowNull: false
  }
});

module.exports = Order;