// Script to create the petcare table
require('dotenv').config();
const sequelize = require('./util/index');

async function createPetCareTable() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Connection established successfully.');

    // Execute raw SQL to create the petcare table if it doesn't exist
    const createTableSQL = `
    CREATE TABLE IF NOT EXISTS petcare (
      id INT AUTO_INCREMENT PRIMARY KEY,
      petId INT NOT NULL,
      ownerName VARCHAR(255) NOT NULL,
      ownerEmail VARCHAR(255) NOT NULL,
      ownerPhone VARCHAR(255) NOT NULL,
      startDate DATETIME NOT NULL,
      endDate DATETIME,
      status VARCHAR(50) DEFAULT 'active',
      notes TEXT
    );
    `;

    console.log('Executing SQL to create petcare table...');
    await sequelize.query(createTableSQL);
    console.log('Table created or already exists.');

    process.exit(0);
  } catch (error) {
    console.error('Error creating petcare table:', error);
    process.exit(1);
  }
}

createPetCareTable(); 