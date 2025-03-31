const PetCare = require('../models/PetCare');
const Pet = require('../models/Pet');

// Create a new pet care entry
exports.createPetCare = async (req, res) => {
  try {
    console.log('Received pet care request:', req.body);
    const { petId, ownerName, ownerEmail, ownerPhone, startDate, endDate, notes } = req.body;

    // Validate required fields
    if (!petId || !ownerName || !ownerEmail || !ownerPhone || !startDate) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if pet exists
    const pet = await Pet.findByPk(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    console.log('Found pet:', pet.name, 'with status:', pet.status);

    // Verify pet is available
    if (!['available', 'Available', 'Approved'].includes(pet.status)) {
      return res.status(400).json({ 
        message: `This pet is not available for care. Current status: ${pet.status}` 
      });
    }

    // Create pet care entry
    const petCare = await PetCare.create({
      petId,
      ownerName,
      ownerEmail,
      ownerPhone,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      notes,
      status: 'active'
    });

    console.log('Pet care entry created:', petCare.id);

    // Update pet availability status - handle case sensitivity
    await pet.update({ 
      status: pet.status === 'available' ? 'in_care' : 
              pet.status === 'Available' ? 'In Care' : 'In Care'
    });

    return res.status(201).json({
      message: 'Pet has been successfully placed in care',
      petCare
    });
  } catch (error) {
    console.error('Error creating pet care entry:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all pets in care
exports.getPetsInCare = async (req, res) => {
  try {
    const petsInCare = await PetCare.findAll({
      where: { status: 'active' },
      include: [{
        model: Pet,
        attributes: ['id', 'name', 'type', 'breed', 'age', 'description', 'image']
      }],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json(petsInCare);
  } catch (error) {
    console.error('Error getting pets in care:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Return pet from care
exports.returnPetFromCare = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the pet care entry
    const petCare = await PetCare.findByPk(id);
    if (!petCare) {
      return res.status(404).json({ message: 'Pet care entry not found' });
    }

    // Update pet care entry
    await petCare.update({
      status: 'completed',
      endDate: new Date()
    });

    // Update pet status
    await Pet.update({ status: 'available' }, { where: { id: petCare.petId } });

    return res.status(200).json({
      message: 'Pet has been returned from care successfully',
      petCare
    });
  } catch (error) {
    console.error('Error returning pet from care:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get pet care history
exports.getPetCareHistory = async (req, res) => {
  try {
    const petCareHistory = await PetCare.findAll({
      include: [{
        model: Pet,
        attributes: ['id', 'name', 'type', 'breed', 'age', 'description', 'image']
      }],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json(petCareHistory);
  } catch (error) {
    console.error('Error getting pet care history:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 