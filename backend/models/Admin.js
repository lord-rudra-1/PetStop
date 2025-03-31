const { DataTypes } = require('sequelize');
const sequelize = require('../util/index');

const Admin = sequelize.define('Admins', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'admins'
});

module.exports = Admin; 