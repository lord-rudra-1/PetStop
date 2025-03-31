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
    allowNull: false,
    references: {
      model: Pet,
      key: 'id'
    }
  },
  ownerName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ownerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
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
    type: DataTypes.ENUM('active', 'completed', 'cancelled'),
    defaultValue: 'active'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

// Set up associations
PetCare.belongsTo(Pet, { foreignKey: 'petId' });
Pet.hasMany(PetCare, { foreignKey: 'petId' });

module.exports = PetCare; 