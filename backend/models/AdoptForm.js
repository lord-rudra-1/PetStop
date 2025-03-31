const { DataTypes } = require('sequelize');
const sequelize = require('../util/index');
const Pet = require('./Pet');

const AdoptForm = sequelize.define('AdoptForms', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
    references: {
      model: Pet,
      key: 'id'
    },
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'adopt_forms'
});

// Create associations
AdoptForm.belongsTo(Pet, { foreignKey: 'petId', onDelete: 'CASCADE' });
Pet.hasMany(AdoptForm, { foreignKey: 'petId', onDelete: 'CASCADE' });

module.exports = AdoptForm; 