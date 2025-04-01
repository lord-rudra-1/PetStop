const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const petController = require('../controllers/PetControllerSQL');
const Pet = require('../models/Pet');
const sequelize = require('../util/index');
const { Op } = require('sequelize');

// Ensure images directory exists
const imagesDir = path.join(__dirname, '../images');
if (!fs.existsSync(imagesDir)) {
  console.log(`Creating images directory at ${imagesDir}`);
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../images'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

// Configure upload options with error handling
const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
}).single('image');

// Custom middleware to handle file uploads with proper error handling
const handleUpload = (req, res, next) => {
  console.log('Handling upload for request to:', req.originalUrl);
  console.log('Content-Type:', req.headers['content-type']);
  
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      console.error('Multer error:', err);
      return res.status(400).json({ message: `Multer error: ${err.message}` });
    } else if (err) {
      // An unknown error occurred
      console.error('Upload error:', err);
      return res.status(400).json({ message: err.message });
    }
    
    // Log the body after multer processing
    console.log('Parsed body after upload middleware:', req.body);
    
    // Everything went fine
    next();
  });
};

// PUBLIC ROUTES

// Get all available pets for adoption
router.get('/available-pets', petController.getAvailablePets);

// Adopt a pet
router.post('/adopt-pet', petController.adoptPet);

// Submit a pet for adoption - use the custom middleware
router.post('/post-pet', handleUpload, (req, res, next) => {
  console.log('Request arrived at /post-pet route handler');
  
  // Simple validation before passing to controller
  const { name, age, email, phone } = req.body;
  if (!name || !age || !email || !phone) {
    console.error('Missing required fields in /post-pet route');
    console.log('Received fields:', Object.keys(req.body));
    return res.status(400).json({ 
      message: 'Missing required fields',
      required: ['name', 'age', 'email', 'phone'],
      received: Object.keys(req.body)
    });
  }
  
  // All good, proceed to controller
  petController.postPetRequest(req, res, next);
});

// Alternative route for submissions without file
router.post('/post-pet-no-file', express.json(), petController.postPetRequest);

// Test endpoint for debugging form submissions
router.post('/test-form-upload', handleUpload, (req, res) => {
  try {
    console.log('Test endpoint received:');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    
    return res.status(200).json({
      message: 'Test form submission received',
      body: req.body,
      file: req.file ? {
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size
      } : null
    });
  } catch (error) {
    console.error('Error in test endpoint:', error);
    return res.status(500).json({ message: 'Test endpoint error', error: error.message });
  }
});

// Add a route for approvedPets to maintain compatibility with frontend
router.get('/approvedPets', async (req, res) => {
  try {
    console.log('Fetching pets for display on pets page (excluding In Care pets)');
    
    // Fetch pets that are not in care
    const pets = await Pet.findAll({
      where: {
        status: {
          [Op.notIn]: ['In Care', 'in care'] // Exclude both variations of the status
        }
      }
    });
    
    console.log(`Found ${pets.length} pets (excluding In Care status)`);
    
    if (pets.length === 0) {
      console.log('No eligible pets found in database, sending empty array');
      return res.status(200).json([]);
    }
    
    // Transform pet data to match expected format in frontend
    const transformedPets = pets.map(pet => {
      return {
        ...pet.toJSON(),
        filename: pet.image // Map image to filename for frontend compatibility
      };
    });
    
    console.log('Sending transformed pets to frontend');
    res.status(200).json(transformedPets);
  } catch (error) {
    console.error('Error fetching pets:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ADMIN ROUTES

// Get all pets
router.get('/admin/pets', petController.getAllPets);

// Get pets by status
router.get('/admin/pets/:status', petController.getPetsByStatus);

// Update pet status (approve/reject)
router.put('/admin/pets/:id', petController.updatePetStatus);

// Delete pet
router.delete('/admin/pets/:id', petController.deletePet);

// TESTING ROUTES - Remove in production
router.put('/make-available/:id', petController.makePetAvailable);

// Debug endpoint to check all pets in database
router.get('/debug/all-pets', async (req, res) => {
  try {
    console.log('Debug endpoint: fetching all pets in database');
    const pets = await Pet.findAll();
    console.log(`Found ${pets.length} total pets in database`);
    
    // Map pets to include key information for debugging
    const petSummary = pets.map(pet => ({
      id: pet.id,
      name: pet.name,
      type: pet.type,
      status: pet.status,
      adopter_name: pet.adopter_name || 'null',
      image: pet.image
    }));
    
    res.status(200).json({
      totalPets: pets.length,
      pets: petSummary,
      fullData: pets
    });
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 