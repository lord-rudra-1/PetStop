const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// If using SQLite
if (process.env.DB_DIALECT === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './database.sqlite',
    logging: false
  });
} else {
  // MySQL or other database
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, 
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: process.env.DB_DIALECT || 'mysql',
      logging: false
    }
  );
}

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Connection to ${process.env.DB_DIALECT || 'mysql'} database has been established successfully.`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = { sequelize, connectToDatabase };
