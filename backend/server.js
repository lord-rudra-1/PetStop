require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./util/index');

// Import models
const Pet = require('./models/Pet');
const AdoptForm = require('./models/AdoptForm');
const PetCare = require('./models/PetCare');

// Initialize models and their relationships
(async () => {
  try {
    // Use alter: true to apply schema changes without dropping tables
    console.log("Syncing database with alter: true to apply schema changes...");
    await sequelize.sync({ force: false, alter: true });
    console.log("Database synced successfully!");
    
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

// Use routes
app.use(petRouter);
app.use('/care', petCareRouter);

// Direct route for leave-pet-care form on Services page
const petCareController = require('./controllers/PetCareController');
app.post('/leave-pet-care', petCareController.leavePetCareRequest);

// Direct route for return-pet-care form on Services page
app.post('/return-pet-care', petCareController.returnPetCareRequest);

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

// Function to start the server
const startServer = (port) => {
  return app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  })
  .on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying port ${port + 1}`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
};

// Start the server
startServer(PORT);

module.exports = app;