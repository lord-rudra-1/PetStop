const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Pet = require('./PetModelSQL');

const AdoptForm = sequelize.define('AdoptForm', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  livingSituation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  previousExperience: {
    type: DataTypes.STRING,
    allowNull: false
  },
  familyComposition: {
    type: DataTypes.STRING,
    allowNull: false
  },
  petId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Pet,
      key: 'id'
    }
  }
}, {
  timestamps: true
});

// Create association
AdoptForm.belongsTo(Pet, { foreignKey: 'petId' });
Pet.hasMany(AdoptForm, { foreignKey: 'petId' });

module.exports = AdoptForm; 