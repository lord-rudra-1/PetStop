const Pet = require('../models/Pet');
const fs = require('fs');
const path = require('path');

// Post a pet for adoption
exports.postPetRequest = async (req, res) => {
  try {
    console.log('Post pet request received:');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    const { name, age, area, justification, email, phone, type } = req.body;
    
    // Validate required fields
    if (!name || !age || !email || !phone) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['name', 'age', 'email', 'phone'],
        received: Object.keys(req.body)
      });
    }
    
    // Handle case where file upload might be missing
    let image = 'default-pet.jpg';
    if (req.file && req.file.filename) {
      image = req.file.filename;
    }

    try {
      const status = process.env.NODE_ENV === 'development' ? 'Approved' : 'Pending';
      console.log(`Setting pet status to: ${status} (based on environment)`);
      
      // Store form data directly
      const pet = await Pet.create({
        name,
        age,
        type: type || 'Other', // Default to 'Other' if type is not provided
        breed: area,          // For compatibility with other parts of the app
        area,                 // Store original form field
        description: justification, // For compatibility with other parts of the app
        justification,        // Store original form field
        email,
        phone,
        image,
        status
      });

      console.log('Pet created successfully:', pet.id);
      
      res.status(201).json({
        message: `Pet post created successfully, status: ${status}`,
        pet
      });
    } catch (dbError) {
      console.error('Database error creating pet record:', dbError);
      // Handle Sequelize validation errors
      if (dbError.name === 'SequelizeValidationError') {
        return res.status(400).json({
          message: 'Validation error',
          errors: dbError.errors.map(e => e.message) 
        });
      }
      throw dbError;
    }
  } catch (error) {
    console.error('Error creating pet record:', error);
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
        status: ['available', 'Available', 'Approved','pending'] // Check for both lowercase and uppercase values
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
    
    console.log('Adopt pet request received:', req.body);
    
    // Find the pet
    const pet = await Pet.findByPk(petId);
    
    if (!pet) {
      console.log('Pet not found with ID:', petId);
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    console.log('Found pet with status:', pet.status);
    
    // Allow pets with status Available, available, or Approved to be adopted
    if (pet.status === 'Adopted') {
      return res.status(400).json({ 
        message: 'This pet is not available for adoption',
        currentStatus: pet.status
      });
    }
    
    // Update pet with adopter info and status
    await pet.update({ 
      status: 'Adopted',  // Use uppercase to be consistent
      adopter_name: adopterName,
      adopter_email: adopterEmail,
      adopter_phone: adopterPhone
    });
    
    console.log('Pet adopted successfully, new status:', pet.status);
    
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