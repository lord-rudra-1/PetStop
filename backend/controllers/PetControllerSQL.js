const Pet = require('../models/Pet');
const fs = require('fs');
const path = require('path');

// Post a pet for adoption
exports.postPetRequest = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    const { name, age, area, justification, email, phone, type } = req.body;
    
    // Validate required fields
    if (!name || !age || !type || !email || !phone) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Handle case where file upload might be missing
    let image = 'default-pet.jpg';
    if (req.file && req.file.filename) {
      image = req.file.filename;
    }

    const pet = await Pet.create({
      name,
      age,
      breed: area || 'Unknown', // Using area as breed, provide default if missing
      description: justification || 'No description provided',
      email,
      phone,
      type,
      image,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Pet post created successfully, awaiting approval',
      pet
    });
  } catch (error) {
    console.error('Error creating pet record:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin approves or rejects a pet post
exports.updatePetStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const pet = await Pet.findByPk(id);
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    // Update pet status
    await pet.update({ status });
    
    res.status(200).json({
      message: `Pet status updated to ${status}`,
      pet
    });
  } catch (error) {
    console.error('Error updating pet status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a pet post
exports.deletePet = async (req, res) => {
  try {
    const { id } = req.params;
    const pet = await Pet.findByPk(id);
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    // Delete associated image if it exists and is not the default
    if (pet.image !== 'default-pet.jpg') {
      const filePath = path.join(__dirname, '../images', pet.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await pet.destroy();
    res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (error) {
    console.error('Error deleting pet:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get pets by status
exports.getPetsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    
    const pets = await Pet.findAll({
      where: { status },
      order: [['updatedAt', 'DESC']]
    });
    
    if (pets.length === 0) {
      return res.status(404).json({ message: `No pets found with status: ${status}` });
    }
    
    res.status(200).json(pets);
  } catch (error) {
    console.error('Error fetching pets by status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all pets
exports.getAllPets = async (req, res) => {
  try {
    const pets = await Pet.findAll({
      order: [['updatedAt', 'DESC']]
    });
    
    res.status(200).json(pets);
  } catch (error) {
    console.error('Error fetching all pets:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get available pets for adoption
exports.getAvailablePets = async (req, res) => {
  try {
    console.log('Fetching available pets...');
    
    // Check both lowercase and uppercase status values
    const pets = await Pet.findAll({
      where: {
        status: ['available', 'Available', 'Approved'] // Check for both lowercase and uppercase values
      },
      order: [['updatedAt', 'DESC']]
    });
    
    console.log(`Found ${pets.length} available pets`);
    
    res.status(200).json(pets);
  } catch (error) {
    console.error('Error fetching available pets:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Adopt a pet
exports.adoptPet = async (req, res) => {
  try {
    const { petId, adopterName, adopterEmail, adopterPhone } = req.body;
    
    // Find the pet
    const pet = await Pet.findByPk(petId);
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    if (pet.status !== 'available') {
      return res.status(400).json({ message: 'This pet is not available for adoption' });
    }
    
    // Update pet with adopter info and status
    await pet.update({ 
      status: 'adopted',
      adopter_name: adopterName,
      adopter_email: adopterEmail,
      adopter_phone: adopterPhone
    });
    
    res.status(200).json({
      message: 'Pet adopted successfully',
      pet
    });
  } catch (error) {
    console.error('Error adopting pet:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add this new function at the end of the file to help with testing
exports.makePetAvailable = async (req, res) => {
  try {
    const { id } = req.params;
    
    const pet = await Pet.findByPk(id);
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    // Make the pet available
    await pet.update({ status: 'available' });
    
    res.status(200).json({
      message: 'Pet is now available for adoption or care',
      pet
    });
  } catch (error) {
    console.error('Error making pet available:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 