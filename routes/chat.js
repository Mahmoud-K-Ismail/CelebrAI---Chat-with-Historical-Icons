import express from 'express';
import Conversation from '../models/Conversation.js';
import ShakespeareanTextGenerator from '../services/ShakespeareanTextGenerator.js';

const router = express.Router();
const textGenerator = new ShakespeareanTextGenerator();

router.post('/start', async (req, res) => {
    try {
        const { character } = req.body;
        const userId = req.user._id; // Assuming user is authenticated
        const conversation = new Conversation({ user: userId, character });
        await conversation.save();
        res.status(201).json({ conversationId: conversation._id });
    } catch (error) {
        res.status(400).json({ message: 'Failed to start conversation', error: error.message });
    }
});

router.post('/message', async (req, res) => {
    try {
        const { conversationId, message } = req.body;
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        // Add user message
        conversation.messages.push({ content: message, isUser: true });

        // Generate and add AI response
        const aiResponse = textGenerator.generateResponse(message);
        conversation.messages.push({ content: aiResponse, isUser: false });

        await conversation.save();
        res.json({ aiResponse });
    } catch (error) {
        res.status(400).json({ message: 'Failed to send message', error: error.message });
    }
});

export default router;
