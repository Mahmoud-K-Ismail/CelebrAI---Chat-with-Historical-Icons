// import express from 'express';
// import Conversation from '../models/Conversation.js';
// import ShakespeareanTextGenerator from '../services/ShakespeareanTextGenerator.js';
//
// const router = express.Router();
// const textGenerator = new ShakespeareanTextGenerator();
//
// router.post('/start', async (req, res) => {
//     try {
//         const { character } = req.body;
//         const userId = req.user._id; // Assuming user is authenticated
//         const conversation = new Conversation({ user: userId, character });
//         await conversation.save();
//         res.status(201).json({ conversationId: conversation._id });
//     } catch (error) {
//         res.status(400).json({ message: 'Failed to start conversation', error: error.message });
//     }
// });
//
// router.post('/message', async (req, res) => {
//     try {
//         const { conversationId, message } = req.body;
//         const conversation = await Conversation.findById(conversationId);
//         if (!conversation) {
//             return res.status(404).json({ message: 'Conversation not found' });
//         }
//
//         // Add user message
//         conversation.messages.push({ content: message, isUser: true });
//
//         // Generate and add AI response
//         const aiResponse = textGenerator.generateResponse(message);
//         conversation.messages.push({ content: aiResponse, isUser: false });
//
//         await conversation.save();
//         res.json({ aiResponse });
//     } catch (error) {
//         res.status(400).json({ message: 'Failed to send message', error: error.message });
//     }
// });
//
// export default router;
import express from 'express';
import Conversation from '../models/Conversation.js';
import ShakespeareanTextGenerator from '../services/ShakespeareanTextGenerator.js';

const router = express.Router();
const textGenerator = new ShakespeareanTextGenerator();

// Start a new conversation
router.post('/start', async (req, res) => {
    try {
        const { character } = req.body;
        const userId = req.user?._id; // Ensure user is authenticated
        if (!userId) {
            console.warn('Unauthorized conversation start attempt'); // Debugging log
            return res.status(401).json({ message: 'Unauthorized' });
        }

        console.log('Starting new conversation for user:', userId, 'with character:', character); // Debugging log

        const conversation = new Conversation({ user: userId, character });
        await conversation.save();

        console.log('New conversation started with ID:', conversation._id); // Debugging log
        res.status(201).json({ conversationId: conversation._id });
    } catch (error) {
        console.error('Error starting conversation:', error.message); // Debugging log
        res.status(400).json({ message: 'Failed to start conversation', error: error.message });
    }
});

// Add a message to the conversation and generate AI response
router.post('/message', async (req, res) => {
    try {
        const { conversationId, message } = req.body;

        console.log('Received message for conversation:', conversationId, 'Message:', message); // Debugging log

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            console.warn('Conversation not found:', conversationId); // Debugging log
            return res.status(404).json({ message: 'Conversation not found' });
        }

        // Add user's message
        conversation.messages.push({ content: message, isUser: true });

        // Generate AI response using custom model
        console.log('Generating AI response...'); // Debugging log
        const aiResponse = textGenerator.generateResponse(message);

        // Add AI response to conversation
        conversation.messages.push({ content: aiResponse, isUser: false });

        // Save updated conversation
        await conversation.save();

        console.log('AI response generated and saved:', aiResponse); // Debugging log
        res.json({ aiResponse });
    } catch (error) {
        console.error('Error processing message:', error.message); // Debugging log
        res.status(400).json({ message: 'Failed to send message', error: error.message });
    }
});
// Fetch chat history for the user
router.get('/history', async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            console.warn('Unauthorized access attempt to chat history'); // Debugging log
            return res.status(401).json({ message: 'Unauthorized' });
        }

        console.log('Fetching chat history for user:', userId); // Debugging log

        const conversations = await Conversation.find({ user: userId }).sort({ createdAt: -1 });
        console.log('Fetched conversations:', conversations.length); // Debugging log

        const history = conversations.map((conversation) => ({
            id: conversation._id,
            character: conversation.character,
            messages: conversation.messages.map((msg) => ({
                content: msg.content,
                isUser: msg.isUser,
                timestamp: msg.timestamp,
            })),
        }));

        console.log('Formatted chat history:', history); // Debugging log
        res.status(200).json({ history });
    } catch (error) {
        console.error('Error fetching chat history:', error.message); // Debugging log
        res.status(500).json({ message: 'Failed to fetch chat history' });
    }
});


export default router;
