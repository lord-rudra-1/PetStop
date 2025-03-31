const Pet = require('../models/Pet');
const fs = require('fs');
const path = require('path');

const postPetRequest = async (req, res) => {
  try {
    const { name, age, area, justification, email, phone, type } = req.body;
    
    // Handle case where file upload might be missing
    let filename = 'default-pet.jpg';
    if (req.file && req.file.filename) {
      filename = req.file.filename;
    }

    const pet = await Pet.create({
      name,
      age,
      area,
      justification,
      email,
      phone,
      type,
      filename,
      status: 'Pending'
    });

    res.status(200).json(pet);
  } catch (error) {
    console.error('Error creating pet record:', error);
    res.status(500).json({ error: error.message });
  }
};

const approveRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    
    const pet = await Pet.findByPk(id);
    
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    
    // Update only status field
    pet.status = status;
    await pet.save();
    
    res.status(200).json(pet);
  } catch (err) {
    console.error('Error approving pet request:', err);
    res.status(500).json({ error: err.message });
  }
};

const allPets = async (reqStatus, req, res) => {
  try {
    const data = await Pet.findAll({
      where: { status: reqStatus },
      order: [['updatedAt', 'DESC']]
    });
    
    if (data.length > 0) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: 'No data found' });
    }
  } catch (err) {
    console.error('Error fetching pets:', err);
    res.status(500).json({ error: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const pet = await Pet.findByPk(id);
    
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    
    // Delete associated image if it exists and is not the default
    if (pet.filename !== 'default-pet.jpg') {
      const filePath = path.join(__dirname, '../images', pet.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await pet.destroy();
    res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (err) {
    console.error('Error deleting pet:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  postPetRequest,
  approveRequest,
  deletePost,
  allPets
}; 