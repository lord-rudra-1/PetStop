require('dotenv').config();
const sequelize = require('./util/index');
const Pet = require('./models/Pet');

// Sample pets data
const samplePets = [
  {
    name: 'Max',
    type: 'Dog',
    breed: 'Labrador',
    age: '3 years',
    description: 'Friendly and energetic Labrador',
    image: 'default-pet.jpg',
    status: 'available',
    email: 'owner1@example.com',
    phone: '1234567890'
  },
  {
    name: 'Luna',
    type: 'Cat',
    breed: 'Siamese',
    age: '2 years',
    description: 'Calm and affectionate Siamese cat',
    image: 'default-pet.jpg',
    status: 'available',
    email: 'owner2@example.com',
    phone: '2345678901'
  },
  {
    name: 'Rocky',
    type: 'Dog',
    breed: 'Beagle',
    age: '1 year',
    description: 'Playful Beagle puppy',
    image: 'default-pet.jpg',
    status: 'available',
    email: 'owner3@example.com',
    phone: '3456789012'
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Sync database without forcing recreation
    await sequelize.sync({ force: false });
    console.log('Database synced');

    // Check for existing pets
    const existingPets = await Pet.count();
    console.log(`Existing pets: ${existingPets}`);

    // Only add test data if no pets exist or all pets are already used
    const availablePets = await Pet.count({ where: { status: 'available' } });
    console.log(`Available pets: ${availablePets}`);

    if (availablePets === 0) {
      // Create pets with available status
      for (const petData of samplePets) {
        await Pet.create(petData);
      }
      console.log('Sample pets created successfully!');
    } else {
      console.log('Available pets already exist, skipping sample data creation');
    }

    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit();
  }
};

// Run the seeding function
seedDatabase(); 