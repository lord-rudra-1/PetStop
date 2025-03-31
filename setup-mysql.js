const mysql = require('mysql2/promise');
require('dotenv').config();

const createDatabase = async () => {
  try {
    // Connect to MySQL server without specifying a database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    console.log('Connected to MySQL server');

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`Database '${process.env.DB_NAME}' created or already exists`);

    // Close the connection
    await connection.end();
    console.log('MySQL setup completed successfully');
    
    return true;
  } catch (error) {
    console.error('Error setting up MySQL:', error);
    return false;
  }
};

// If this file is run directly
if (require.main === module) {
  createDatabase()
    .then(success => {
      if (success) {
        console.log('Setup completed, you can now start the application');
      } else {
        console.error('Setup failed');
        process.exit(1);
      }
    });
}

module.exports = { createDatabase }; 