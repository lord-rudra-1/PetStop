const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const petController = require('../controllers/PetControllerSQL');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../images'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// PUBLIC ROUTES

// Get all available pets for adoption
router.get('/available-pets', petController.getAvailablePets);

// Adopt a pet
router.post('/adopt-pet', petController.adoptPet);

// Submit a pet for adoption
router.post('/post-pet', upload.single('image'), petController.postPetRequest);

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

module.exports = router; 