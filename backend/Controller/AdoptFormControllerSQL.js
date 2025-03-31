const AdoptForm = require('../models/AdoptForm');
const Pet = require('../models/Pet');

const saveForm = async (req, res) => {
    try {
        const { email, livingSituation, phoneNo, previousExperience, familyComposition, petId } = req.body;
        
        // Validate if pet exists before creating adoption form
        const petExists = await Pet.findByPk(petId);
        if (!petExists) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        
        const form = await AdoptForm.create({ 
            email, 
            livingSituation, 
            phoneNo, 
            previousExperience, 
            familyComposition, 
            petId 
        });

        res.status(201).json(form);
    } catch (err) {
        console.error('Error saving adoption form:', err);
        res.status(400).json({ message: err.message });
    }
};

const getAdoptForms = async (req, res) => {
    try {
        const forms = await AdoptForm.findAll({
            order: [['createdAt', 'DESC']],
            include: [{ model: Pet, attributes: ['name', 'type', 'status'] }]
        });
        
        if (forms.length === 0) {
            return res.status(404).json({ message: 'No adoption forms found' });
        }
        
        res.status(200).json(forms);
    } catch (err) {
        console.error('Error fetching adoption forms:', err);
        res.status(500).json({ message: err.message });
    }
};

const deleteForm = async (req, res) => {
    try {
        const { id } = req.params;
        const form = await AdoptForm.findByPk(id);
        
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }
        
        await form.destroy();
        res.status(200).json({ message: 'Form deleted successfully' });
    } catch (err) {
        console.error('Error deleting adoption form:', err);
        res.status(500).json({ message: err.message });
    }
};

const deleteAllRequests = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate if pet exists
        const petExists = await Pet.findByPk(id);
        if (!petExists) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        
        const result = await AdoptForm.destroy({ 
            where: { petId: id } 
        });
        
        if (result === 0) {
            return res.status(404).json({ message: 'No adoption forms found for this pet' });
        }
        
        res.status(200).json({ message: `Successfully deleted ${result} adoption forms` });
    } catch (error) {
        console.error('Error deleting adoption forms:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    saveForm,
    getAdoptForms,
    deleteForm,
    deleteAllRequests
}; 