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
    allowNull: false,
    validate: {
      isEmail: true
    }
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
    type: DataTypes.TEXT,
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
  timestamps: true,
  tableName: 'adopt_forms'
});

// Create association
AdoptForm.belongsTo(Pet, { foreignKey: 'petId', onDelete: 'CASCADE' });
Pet.hasMany(AdoptForm, { foreignKey: 'petId', onDelete: 'CASCADE' });

module.exports = AdoptForm; 