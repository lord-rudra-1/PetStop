require('dotenv').config();
const { sequelize } = require('./config/database');
const Pet = require('./Model/PetModelSQL');
const Admin = require('./Model/AdminModelSQL');
const AdoptForm = require('./Model/AdoptFormModelSQL');

const seedData = async () => {
  try {
    // Sync all models - force:true will drop tables first (USE WITH CAUTION)
    await sequelize.sync({ force: false, alter: true });
    console.log('Database synced');
    
    // Create admin if not exists
    const adminExists = await Admin.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
      await Admin.create({
        username: 'admin',
        password: 'admin123'
      });
      console.log('Default admin created');
    }
    
    // Create sample pets if none exist
    const petCount = await Pet.count();
    if (petCount === 0) {
      const pets = [
        {
          name: 'Max',
          age: '2 years',
          area: 'Delhi',
          justification: 'Moving to a new apartment that does not allow pets',
          email: 'owner1@example.com',
          phone: '9876543210',
          type: 'Dog',
          filename: 'default-pet.jpg',
          status: 'Approved'
        },
        {
          name: 'Luna',
          age: '1 year',
          area: 'Mumbai',
          justification: 'Found as a stray kitten, need to find her a loving home',
          email: 'owner2@example.com',
          phone: '8765432109',
          type: 'Cat',
          filename: 'default-pet.jpg',
          status: 'Pending'
        },
        {
          name: 'Buddy',
          age: '3 years',
          area: 'Bangalore',
          justification: 'Owner moving abroad',
          email: 'owner3@example.com',
          phone: '7654321098',
          type: 'Dog',
          filename: 'default-pet.jpg',
          status: 'Adopted'
        }
      ];
      
      await Pet.bulkCreate(pets);
      console.log('Sample pets created');
      
      // Create a sample adoption form
      const pet = await Pet.findOne({ where: { status: 'Adopted' } });
      if (pet) {
        await AdoptForm.create({
          email: 'adopter@example.com',
          phoneNo: '9988776655',
          livingSituation: 'House with yard',
          previousExperience: 'Had dogs for 10 years',
          familyComposition: 'Couple with no children',
          petId: pet.id
        });
        console.log('Sample adoption form created');
      }
    }
    
    console.log('Database seeding completed');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
};

// Run the function
seedData(); 