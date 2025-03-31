const Admin = require('../models/Admin');
const Pet = require('../models/Pet');
const AdoptForm = require('../models/AdoptForm');

const getCredentials = async (req, res) => {
    try {
        // Find admin or create default admin if none exists
        const [admin, created] = await Admin.findOrCreate({
            where: { username: 'admin' },
            defaults: {
                username: 'admin',
                password: 'admin123'  // Update to more secure password
            }
        });

        // Note: Exposing passwords in API responses is a security risk
        // In a production app, you would use proper authentication 
        res.status(200).json({ 
            username: admin.username, 
            password: admin.password 
        });
    } catch (error) {
        console.error('Error fetching admin credentials:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get statistics for admin dashboard
const getStats = async (req, res) => {
    try {
        const totalPets = await Pet.count();
        const pendingPets = await Pet.count({ where: { status: 'Pending' } });
        const approvedPets = await Pet.count({ where: { status: 'Approved' } });
        const adoptedPets = await Pet.count({ where: { status: 'Adopted' } });
        const totalAdoptForms = await AdoptForm.count();
        
        res.status(200).json({
            totalPets,
            pendingPets,
            approvedPets,
            adoptedPets,
            totalAdoptForms
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    getCredentials,
    getStats
}; 