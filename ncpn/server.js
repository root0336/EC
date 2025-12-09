// server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');

const apiRoutes = require('./routes/api');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// --- Database Connection ---
const uri = process.env.MONGO_URI;
mongoose.connect(uri)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- Middleware ---
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// --- API Routes ---
app.use('/api', apiRoutes);

// --- Chatbot Logic (Basic Service) ---
const basicBotResponse = (userMessage) => {
    const lowerCaseMsg = userMessage.toLowerCase();
    
    if (lowerCaseMsg.includes('hello') || lowerCaseMsg.includes('hi')) {
        return "Hello there! How can I assist you with your project today?";
    } else if (lowerCaseMsg.includes('cloud')) {
        return "This project is deployed on a cloud platform (e.g., AWS/Azure) to demonstrate cloud services and scalability.";
    } else if (lowerCaseMsg.includes('technology') || lowerCaseMsg.includes('tech stack')) {
        return "The suggested tech stack includes Node.js/Express for the server, MongoDB for the database, and HTML/CSS/JS for the frontend.";
    } else if (lowerCaseMsg.includes('real-time') || lowerCaseMsg.includes('websocket')) {
        return "Real-time communication is achieved using WebSockets (Socket.io) to instantly send messages between the client and server.";
    } else if (lowerCaseMsg.includes('bye')) {
        return "Goodbye! Feel free to come back if you have any other questions.";
    } else {
        return "I'm a basic service bot. I can answer common project FAQs. Try asking about 'cloud' or 'tech stack'.";
    }
};

// --- Socket.io Real-time Communication ---
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('sendMessage', async (msg) => {
        // 1. Save User Message
        const userMessage = new Message({ sender: 'user', content: msg });
        await userMessage.save();
        
        // Broadcast the user message to all clients
        io.emit('newMessage', userMessage);

        // 2. Generate and Save Bot Response (Simulating AI/NLP response)
        const botText = basicBotResponse(msg);
        const botMessage = new Message({ sender: 'bot', content: botText });
        await botMessage.save();
        
        // Send the bot response to all clients
        // Delay to simulate processing time
        setTimeout(() => {
            io.emit('newMessage', botMessage);
        }, 500); 
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// --- Server Startup ---
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser to use the chatbot.`);
});