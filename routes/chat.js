import express from 'express';
import Conversation from '../models/Conversation.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /message - Send a message and generate AI response
router.post('/message', async (req, res) => {
    try {
        const { conversationId, message } = req.body; // Get conversationId and message from request
        const userId = req.user?._id; // Ensure the user is authenticated

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!conversationId || !message) {
            return res.status(400).json({ message: 'Conversation ID and message content are required.' });
        }

        console.log('Received message:', message, 'for conversation:', conversationId);

        // Find the conversation by ID and user
        const conversation = await Conversation.findOne({ _id: conversationId, user: userId });

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found.' });
        }

        // Add the user's message to the conversation
        conversation.messages.push({ content: message, isUser: true });

        // Generate AI response using Gemini API
        console.log('Generating AI response...');
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(message);
        const response = await result.response;
        const aiResponse = await response.text();

        // Add the AI response to the conversation
        conversation.messages.push({ content: aiResponse, isUser: false });

        // Save the updated conversation to the database
        await conversation.save();
        console.log('Updated conversation saved successfully.');

        // Respond with the AI-generated reply
        res.status(200).json({ reply: aiResponse });
    } catch (error) {
        console.error('Error processing message:', error.message);
        res.status(500).json({ message: 'Failed to process message.', error: error.message });
    }
});

// GET /history - Fetch all conversations for the authenticated user
router.get('/history', async (req, res) => {
    try {
        const userId = req.user?._id; // Ensure the user is authenticated

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        console.log('Fetching chat history for user:', userId);

        // Fetch all conversations for the authenticated user
        const conversations = await Conversation.find({ user: userId }).sort({ createdAt: -1 });

        console.log('Fetched chat history:', conversations);

        res.status(200).json({ history: conversations });
    } catch (error) {
        console.error('Error fetching chat history:', error.message);
        res.status(500).json({ message: 'Failed to fetch chat history.' });
    }
});

// POST /start - Start a new conversation
router.post('/start', async (req, res) => {
    try {
        const userId = req.user?._id; // Ensure the user is authenticated

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        console.log('Starting a new conversation for user:', userId);

        // Create a new conversation for the authenticated user
        const conversation = new Conversation({
            user: userId,
            character: 'Gemini Bot',
            messages: [],
        });

        await conversation.save();
        console.log('New conversation created:', conversation);

        res.status(201).json(conversation);
    } catch (error) {
        console.error('Error starting new conversation:', error.message);
        res.status(500).json({ message: 'Failed to start new conversation.', error: error.message });
    }
});

// DELETE /delete/:id - Delete a conversation
router.delete('/delete/:id', async (req, res) => {
    try {
        const userId = req.user?._id; // Ensure the user is authenticated
        const conversationId = req.params.id; // Get the conversation ID from request params

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        console.log('Deleting conversation:', conversationId, 'for user:', userId);

        // Find and delete the conversation
        const conversation = await Conversation.findOneAndDelete({ _id: conversationId, user: userId });

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found or not authorized to delete.' });
        }

        console.log('Conversation deleted successfully:', conversationId);

        res.status(200).json({ message: 'Conversation deleted successfully.' });
    } catch (error) {
        console.error('Error deleting conversation:', error.message);
        res.status(500).json({ message: 'Failed to delete conversation.', error: error.message });
    }
});

export default router;
