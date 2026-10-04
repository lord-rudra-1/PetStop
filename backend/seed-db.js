const sequelize = require('./util/index');
const Pet = require('./models/Pet');
const AdoptForm = require('./models/AdoptForm');

const petNames = ["Bella", "Max", "Luna", "Charlie", "Lucy", "Cooper", "Daisy", "Milo", "Zoe", "Rocky", "Stella", "Bear", "Lily", "Tucker", "Lola", "Oliver", "Sadie", "Duke", "Chloe", "Teddy", "Penny", "Leo", "Ruby", "Winston", "Rosie", "Zeus", "Nala", "Bandit", "Mia", "Toby", "Piper", "Finn", "Coco", "Buster", "Gracie", "Murphy", "Abby", "Bruno", "Ginger", "Jasper", "Roxy", "Harley", "Riley", "Gus", "Sasha", "Ollie", "Hazel", "Hank", "Willow", "Oscar"];
const locations = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Pune", "Hyderabad", "Jaipur", "Ahmedabad", "Chandigarh"];
const types = ["Dog", "Cat", "Rabbit", "Bird"];
const statuses = ["Approved", "Pending", "Adopted"];

(async () => {
    try {
        await sequelize.sync({ force: true });
        console.log("Database synced and reset successfully!");

        const petsToInsert = [];
        for (let i = 0; i < 50; i++) {
            petsToInsert.push({
                name: petNames[i],
                age: `${Math.floor(Math.random() * 5) + 1} years`,
                area: locations[Math.floor(Math.random() * locations.length)],
                justification: 'Looking for a loving forever home!',
                email: `owner${i}@example.com`,
                phone: `98765432${i.toString().padStart(2, '0')}`,
                type: types[Math.floor(Math.random() * types.length)],
                filename: 'default-pet.jpg',
                status: statuses[Math.floor(Math.random() * statuses.length)]
            });
        }
        
        await Pet.bulkCreate(petsToInsert);
        console.log('50 Sample pets created successfully!');
        
        console.log('Database seeding completed successfully!');
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        process.exit();
    }
})();