// public/chat.js
document.addEventListener('DOMContentLoaded', () => {
    // Connect to the Socket.io server
    const socket = io();

    const chatWindow = document.getElementById('chat-window');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-btn');

    // Helper function to format the time
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    // Function to append a message to the chat window
    const appendMessage = (msg) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(`${msg.sender}-message`);

        const bubble = document.createElement('div');
        bubble.classList.add('message-bubble');
        bubble.textContent = msg.content;
        
        const time = document.createElement('span');
        time.classList.add('timestamp');
        time.textContent = formatTime(msg.timestamp);

        // Put the message and timestamp together
        if (msg.sender === 'user') {
            messageElement.appendChild(bubble);
            messageElement.appendChild(time);
        } else {
            messageElement.appendChild(time); // Bot message timestamp usually on the left in this style
            messageElement.appendChild(bubble);
        }

        chatWindow.appendChild(messageElement);
        
        // Auto-scroll to the bottom
        chatWindow.scrollTop = chatWindow.scrollHeight;
    };

    // Function to load chat history
    const loadHistory = async () => {
        try {
            const response = await fetch('/api/history');
            const history = await response.json();
            history.forEach(appendMessage);
        } catch (error) {
            console.error('Failed to load chat history:', error);
            // Optionally display a user-friendly error message
        }
    };

    // Handle sending a message
    const sendMessage = () => {
        const content = messageInput.value.trim();
        if (content) {
            // Emit the message to the server via Socket.io
            socket.emit('sendMessage', content);
            messageInput.value = ''; // Clear input
        }
    };

    // Attach event listeners
    sendButton.addEventListener('click', sendMessage);

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Handle incoming messages from the server
    socket.on('newMessage', (msg) => {
        appendMessage(msg);
    });

    // Load history when the page loads
    loadHistory();
});