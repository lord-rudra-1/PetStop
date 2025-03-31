const { DataTypes } = require('sequelize');
const sequelize = require('../util/index');

const Pet = sequelize.define('pet', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  breed: {
    type: DataTypes.STRING,
    allowNull: true
  },
  age: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'default-pet.jpg'
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Available', 'Approved', 'Adopted', 'In Care', 'Rejected'),
    defaultValue: 'Pending'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Additional fields for adoption information
  adopter_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  adopter_email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  adopter_phone: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Pet; 