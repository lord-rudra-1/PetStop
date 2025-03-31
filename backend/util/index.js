const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Log the config values for debugging
console.log("DB Config:", {
  DB_NAME: process.env.DB_NAME,
  DB_USERNAME: process.env.DB_USERNAME, 
  PASS: process.env.PASS,
  HOST: process.env.HOST,
  DIALECT: process.env.DIALECT || 'mysql'
});

// Default to mysql if no dialect is specified
const dialect = process.env.DIALECT || 'mysql';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'petstop_db',
  process.env.DB_USERNAME || 'root',
  process.env.PASS || '', 
  {
    host: process.env.HOST || 'localhost',
    dialect,
    ...(dialect === 'mysql' && {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    })
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}
testConnection();

module.exports = sequelize; 