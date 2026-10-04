const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const dialect = process.env.DIALECT || 'sqlite';

console.log("DB Config:", {
  DB_NAME: process.env.DB_NAME,
  DB_USERNAME: process.env.DB_USERNAME,
  HOST: process.env.HOST,
  DIALECT: dialect
});

const sequelize = new Sequelize(
  process.env.DB_NAME || 'petstop_db',
  process.env.DB_USERNAME || 'root',
  process.env.PASS || '', 
  {
    host: process.env.HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect,
    ...(dialect === 'sqlite' && { storage: path.join(__dirname, '../database.sqlite') }),
    ...((dialect === 'mysql' || dialect === 'postgres') && {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    }),
    logging: false
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