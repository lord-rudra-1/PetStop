const express = require('express');
const router = express.Router();
const petCareController = require('../controllers/PetCareController');

// Create a new pet care entry (Leave a pet in care)
router.post('/leave-pet', petCareController.createPetCare);

// Get all pets currently in care
router.get('/pets-in-care', petCareController.getPetsInCare);

// Return a pet from care
router.put('/return-pet/:id', petCareController.returnPetFromCare);

// Get pet care history
router.get('/history', petCareController.getPetCareHistory);

module.exports = router; 