// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Message = require('./models/Message');

const uri = process.env.MONGO_URI;

if (!uri) {
    console.error("MONGO_URI not set in .env file. Cannot connect to database.");
    process.exit(1);
}

const seedMessages = [
    { sender: 'bot', content: "Hi! I'm a Bot. Let me know if you have any questions about our Net-Centric Programming project or cloud services." },
    { sender: 'user', content: 'What is the main objective of this project?' },
    { sender: 'bot', content: 'The main objective is to design and implement a chatbot on a cloud platform, demonstrating client-server communication and cloud services.' }
];

const seedDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log('MongoDB connected for seeding.');

        // Clear existing data
        await Message.deleteMany({});
        console.log('Existing messages cleared.');

        // Insert new seed data
        await Message.insertMany(seedMessages);
        console.log('Database seeded successfully!');

    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        // Close the connection
        mongoose.connection.close();
        console.log('MongoDB connection closed.');
    }
};

seedDB();