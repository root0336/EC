// routes/api.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

/**
 * @route GET /api/history
 * @desc Get all chat messages (history)
 * @access Public
 */
router.get('/history', async (req, res) => {
    try {
        const history = await Message.find().sort({ timestamp: 1 });
        res.json(history);
    } catch (err) {
        console.error('Error fetching chat history:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;