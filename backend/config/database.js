const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// Check if using SQLite
if (process.env.DIALECT === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './database.sqlite',
    logging: false
  });
} else {
  // MySQL database connection with SSL
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.PASS, 
    {
      host: process.env.HOST,
      port: process.env.PORT,
      dialect: process.env.DIALECT || 'mysql',
      logging: false,
      dialectOptions: {
        ssl: {
          rejectUnauthorized: true
        }
      }
    }
  );
}

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Connection to ${process.env.DIALECT || 'mysql'} database has been established successfully.`);
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

module.exports = { sequelize, connectToDatabase };
