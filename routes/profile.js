import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.get('/profile', async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate('conversations');
        const profile = {
            username: user.username,
            conversations: user.conversations.map((conv) => ({
                id: conv._id,
                character: conv.character,
                messagesCount: conv.messages.length,
            })),
        };
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch profile' });
    }
});

router.post('/profile/update', async (req, res) => {
    try {
        const userId = req.user._id;
        const { username, password } = req.body;
        const user = await User.findById(userId);
        if (username) user.username = username;
        if (password) user.password = password;
        await user.save();
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update profile' });
    }
});

export default router;
