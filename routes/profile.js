import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Fetch user profile
router.get('/profile', async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            console.warn('Unauthorized profile access attempt'); // Debugging log
            return res.status(401).json({ message: 'Unauthorized' });
        }

        console.log('Fetching profile for user:', userId); // Debugging log

        const user = await User.findById(userId).populate('conversations');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const profile = {
            username: user.username,
            conversations: user.conversations.map((conv) => ({
                id: conv._id,
                character: conv.character,
                messagesCount: conv.messages.length,
            })),
        };

        console.log('User profile fetched successfully:', profile); // Debugging log
        res.status(200).json(profile);
    } catch (error) {
        console.error('Error fetching user profile:', error.message); // Debugging log
        res.status(500).json({ message: 'Failed to fetch profile' });
    }
});

export default router;
