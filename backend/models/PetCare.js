const { DataTypes } = require('sequelize');
const sequelize = require('../util/index');
const Pet = require('./Pet');

const PetCare = sequelize.define('petcare', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  petId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ownerName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ownerEmail: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ownerPhone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: false,
  tableName: 'petcare',
  indexes: []
});

// Define association but make it optional during operations
PetCare.belongsTo(Pet, { 
  foreignKey: 'petId',
  constraints: false
});

module.exports = PetCare; 