// Add pet manually to database
require('dotenv').config();
const sequelize = require('./util/index');
const Pet = require('./models/Pet');

async function addPets() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Connection established successfully.');

    // Create test pets
    const pets = [
      {
        name: 'Max',
        type: 'Dog',
        breed: 'Golden Retriever',
        age: '3 years',
        description: 'Friendly dog who loves to play',
        image: 'default-pet.jpg',
        status: 'Approved',
        email: 'owner@example.com',
        phone: '123-456-7890',
        area: 'Downtown'
      },
      {
        name: 'Luna',
        type: 'Cat',
        breed: 'Siamese',
        age: '2 years',
        description: 'Calm and affectionate cat',
        image: 'default-pet.jpg',
        status: 'Approved',
        email: 'cat.owner@example.com',
        phone: '987-654-3210',
        area: 'North Side'
      },
      {
        name: 'Buddy',
        type: 'Dog',
        breed: 'Labrador',
        age: '1 year',
        description: 'Energetic and playful puppy',
        image: 'default-pet.jpg',
        status: 'Approved',
        email: 'dog.lover@example.com',
        phone: '555-123-4567',
        area: 'West Side'
      }
    ];

    // Add each pet
    for (const petData of pets) {
      try {
        const pet = await Pet.create(petData);
        console.log(`Pet "${pet.name}" added successfully with ID: ${pet.id}`);
      } catch (err) {
        console.error(`Error adding pet "${petData.name}":`, err.message);
      }
    }

    console.log('Process completed');
    process.exit(0);
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  }
}

addPets(); 