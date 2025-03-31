require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./util/index');

// Import models
const Pet = require('./models/Pet');
const AdoptForm = require('./models/AdoptForm');
const Admin = require('./models/Admin');
const PetCare = require('./models/PetCare');

// Initialize models and their relationships
(async () => {
  try {
    await sequelize.sync({ force: false, alter: true }); // Set force: true to recreate tables
    console.log("Database synced successfully!");
    
    // Create default admin if needed
    const adminExists = await Admin.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
      await Admin.create({
        username: 'admin',
        password: 'admin123'
      });
      console.log('Default admin account created');
    }
  } catch (error) {
    console.error("Error syncing database:", error);
  }
})();

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes - update to use SQL versions
const petRouter = require('./Routes/PetRouteSQL');
const petCareRouter = require('./Routes/PetCareRoutes');
const AdoptFormRoute = require('./Routes/AdoptFormRouteSQL');
const AdminRoute = require('./Routes/AdminRouteSQL');

// Use routes
app.use(petRouter);
app.use('/care', petCareRouter);
app.use('/form', AdoptFormRoute);
app.use('/admin', AdminRoute);

// Add default health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT_SERVER || 5002;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;