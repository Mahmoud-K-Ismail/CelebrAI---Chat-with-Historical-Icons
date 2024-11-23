import express from 'express';
import Conversation from '../models/Conversation.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

        // Fetch the conversation to get the character name
        const conversation = await Conversation.findOne({ _id: conversationId, user: userId });

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found.' });
        }

        const characterName = conversation.character || 'Shakespeare'; // Default to Shakespeare if no character name

        console.log(`Generating response in the style of ${characterName}...`);

        // Construct the prompt for the character's style
        const prompt = `
You are ${characterName}. Write your response in their speaking style.
User: "${message}"
${characterName}:`;

        // Generate AI response using Gemini API
        console.log('Generating AI response...');
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiResponse = await response.text();

        console.log(`Generated AI response in ${characterName}'s style:`, aiResponse);

        // Add the user's message and AI's response to the conversation
        conversation.messages.push({ content: message, isUser: true });
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
// PATCH /update/:id - Update the name of a conversation
router.patch('/update/:id', async (req, res) => {
    try {
        const userId = req.user?._id; // Ensure the user is authenticated
        const conversationId = req.params.id; // Get the conversation ID from request params
        const { character } = req.body; // Get the new name from the request body

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!character || character.trim() === '') {
            return res.status(400).json({ message: 'Character name is required.' });
        }

        console.log(`Updating conversation ${conversationId} for user ${userId} with new name: ${character}`);

        // Find and update the conversation's character name
        const conversation = await Conversation.findOneAndUpdate(
            { _id: conversationId, user: userId },
            { character },
            { new: true } // Return the updated document
        );

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found or not authorized to update.' });
        }

        console.log('Conversation updated successfully:', conversation);

        // Send the updated conversation directly
        res.status(200).json(conversation);
    } catch (error) {
        console.error('Error updating conversation:', error.message);
        res.status(500).json({ message: 'Failed to update conversation.', error: error.message });
    }
});


export default router;