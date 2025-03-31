require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectToDatabase, sequelize } = require('./config/database');

// Import routes
const petRouter = require('./Routes/PetRouteSQL');
const AdoptFormRoute = require('./Routes/AdoptFormRouteSQL');
const AdminRoute = require('./Routes/AdminRouteSQL');

const app = express();

// Middleware
app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use(petRouter);
app.use('/form', AdoptFormRoute);
app.use('/admin', AdminRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Import models for sync
const Pet = require('./Model/PetModelSQL');
const AdoptForm = require('./Model/AdoptFormModelSQL');
const Admin = require('./Model/AdminModelSQL');

const startServer = async () => {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Sync all models
    await sequelize.sync({ alter: true });
    
    console.log('All models were synchronized successfully.');
    
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();