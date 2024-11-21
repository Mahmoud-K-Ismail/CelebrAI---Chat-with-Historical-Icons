import express from 'express';
import Conversation from '../models/Conversation.js';

const router = express.Router();

router.post('/message', async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user?._id; // Ensure the user is authenticated
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Find or create the latest conversation
        let conversation = await Conversation.findOne({ user: userId }).sort({ createdAt: -1 });

        // If no conversation exists, create a new one
        if (!conversation) {
            conversation = new Conversation({ user: userId, character: 'Gemini Bot', messages: [] });
        }

        // Add user message
        conversation.messages.push({ content: message, isUser: true });

        // Generate AI response (you might use your AI generation logic here)
        const aiResponse = `Response to "${message}"`; // Replace this with real AI response
        conversation.messages.push({ content: aiResponse, isUser: false });

        // Save the conversation
        await conversation.save();

        // Return the AI response to the frontend
        res.json({ aiResponse });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(400).json({ message: 'Failed to send message', error: error.message });
    }
});

router.get('/history', async (req, res) => {
    try {
        const userId = req.user?._id; // Ensure the user is authenticated
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Fetch user conversations from the database
        const conversations = await Conversation.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json({ history: conversations });
    } catch (error) {
        console.error('Error fetching chat history:', error.message);
        res.status(500).json({ message: 'Failed to fetch chat history' });
    }
});
router.post('/start', async (req, res) => {
    try {
        const userId = req.user?._id; // Ensure the user is authenticated
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Create a new conversation
        const conversation = new Conversation({
            user: userId,
            character: 'Gemini Bot',
            messages: [],
        });

        await conversation.save();

        res.status(201).json(conversation);
    } catch (error) {
        console.error('Error starting new conversation:', error);
        res.status(500).json({ message: 'Failed to start new conversation', error: error.message });
    }
});
router.delete('/delete/:id', async (req, res) => {
    try {
        const userId = req.user?._id;
        const conversationId = req.params.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const conversation = await Conversation.findOneAndDelete({ _id: conversationId, user: userId });

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found or not authorized to delete.' });
        }

        res.status(200).json({ message: 'Conversation deleted successfully.' });
    } catch (error) {
        console.error('Error deleting conversation:', error);
        res.status(500).json({ message: 'Failed to delete conversation.', error: error.message });
    }
});

export default router;
// import express from 'express';
// import Conversation from '../models/Conversation.js'; // Ensure this schema exists
//
// const router = express.Router();
//
// // Fetch chat history
// router.get('/history', async (req, res) => {
//     try {
//         const userId = req.user?._id; // Ensure the user is authenticated
//         if (!userId) {
//             return res.status(401).json({ error: 'Unauthorized' });
//         }
//
//         const conversations = await Conversation.find({ user: userId }).sort({ createdAt: -1 });
//         res.json({ history: conversations });
//     } catch (error) {
//         console.error(`[Chat History Error] ${error.message}`);
//         res.status(500).json({ error: 'Failed to fetch chat history.' });
//     }
// });
//
// // Start a new conversation
// router.post('/start', async (req, res) => {
//     try {
//         const userId = req.user?._id;
//         if (!userId) {
//             return res.status(401).json({ error: 'Unauthorized' });
//         }
//
//         const newConversation = new Conversation({
//             user: userId,
//             character: 'Gemini Bot',
//             messages: [],
//         });
//
//         await newConversation.save();
//         res.status(201).json(newConversation);
//     } catch (error) {
//         console.error(`[Start Conversation Error] ${error.message}`);
//         res.status(500).json({ error: 'Failed to start a new conversation.' });
//     }
// });
//
// // Delete a conversation
// router.delete('/delete/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const userId = req.user?._id;
//
//         if (!userId) {
//             return res.status(401).json({ error: 'Unauthorized' });
//         }
//
//         const conversation = await Conversation.findOneAndDelete({ _id: id, user: userId });
//         if (!conversation) {
//             return res.status(404).json({ error: 'Conversation not found or unauthorized.' });
//         }
//
//         res.json({ message: 'Conversation deleted successfully.' });
//     } catch (error) {
//         console.error(`[Delete Conversation Error] ${error.message}`);
//         res.status(500).json({ error: 'Failed to delete conversation.' });
//     }
// });
//
// export default router;
