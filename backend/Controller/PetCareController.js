const PetCare = require('../models/PetCare');
const Pet = require('../models/Pet');

// Leave a pet in our care
const leavePetInCare = async (req, res) => {
  try {
    const { 
      name, age, area, type, owner_name, owner_phone, owner_email, 
      expected_end_date, care_notes 
    } = req.body;
    
    // First create a pet entry
    let filename = 'default-pet.jpg';
    if (req.file && req.file.filename) {
      filename = req.file.filename;
    }
    
    const pet = await Pet.create({
      name,
      age,
      area,
      justification: 'Pet left in care',
      email: owner_email,
      phone: owner_phone,
      type,
      filename,
      status: 'In Care'
    });
    
    // Create care record
    const careRecord = await PetCare.create({
      pet_id: pet.id,
      owner_name,
      owner_phone,
      owner_email,
      expected_end_date: expected_end_date || null,
      care_notes: care_notes || null,
      care_status: 'Active'
    });
    
    res.status(201).json({
      pet,
      care: careRecord
    });
    
  } catch (error) {
    console.error('Error leaving pet in care:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all pets in care
const getPetsInCare = async (req, res) => {
  try {
    const petsInCare = await PetCare.findAll({
      where: { care_status: 'Active' },
      include: [{ model: Pet }],
      order: [['start_date', 'DESC']]
    });
    
    if (petsInCare.length === 0) {
      return res.status(404).json({ message: 'No pets currently in care' });
    }
    
    res.status(200).json(petsInCare);
  } catch (error) {
    console.error('Error fetching pets in care:', error);
    res.status(500).json({ error: error.message });
  }
};

// Return a pet from care
const returnPetFromCare = async (req, res) => {
  try {
    const { care_id, owner_name, owner_phone, owner_email } = req.body;
    
    // Find the care record
    const careRecord = await PetCare.findByPk(care_id);
    
    if (!careRecord) {
      return res.status(404).json({ message: 'Care record not found' });
    }
    
    // Verify owner details (simple verification)
    if (
      careRecord.owner_email !== owner_email || 
      careRecord.owner_name !== owner_name || 
      careRecord.owner_phone !== owner_phone
    ) {
      return res.status(403).json({ message: 'Owner verification failed' });
    }
    
    // Update care record
    careRecord.care_status = 'Returned';
    careRecord.actual_end_date = new Date();
    await careRecord.save();
    
    // Update pet status
    const pet = await Pet.findByPk(careRecord.pet_id);
    if (pet) {
      pet.status = 'Available'; // You might want to change this depending on your business logic
      await pet.save();
    }
    
    res.status(200).json({
      message: 'Pet returned successfully',
      careRecord
    });
    
  } catch (error) {
    console.error('Error returning pet from care:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  leavePetInCare,
  getPetsInCare,
  returnPetFromCare
}; 