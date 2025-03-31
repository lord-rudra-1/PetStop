require('dotenv').config();
const { sequelize } = require('./config/database');
const Admin = require('./Model/AdminModelSQL');

const createDefaultAdmin = async () => {
  try {
    // Sync the database
    await sequelize.sync();
    
    // Check if admin account exists
    const adminExists = await Admin.findOne({
      where: { username: 'admin' }
    });
    
    if (!adminExists) {
      // Create default admin
      await Admin.create({
        username: 'admin',
        password: 'admin123'
      });
      console.log('Default admin account created');
    } else {
      console.log('Admin account already exists');
    }
  } catch (error) {
    console.error('Error creating admin account:', error);
  } finally {
    // Close the connection
    await sequelize.close();
  }
};

// Run the seed function
createDefaultAdmin(); 