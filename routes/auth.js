import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Registration failed', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }
        req.login(user, (err) => {
            if (err) return res.status(500).json({ message: 'Login failed.' });
            res.status(200).json({ message: 'Login successful!' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed.', error: error.message });
    }
});

router.get('/me', (req, res) => {
    if (req.isAuthenticated()) {
        return res.json({ user: req.user });
    }
    res.status(401).json({ message: 'Unauthorized' });
});
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ message: 'Failed to logout' });
        }
        req.session.destroy(() => {
            res.clearCookie('connect.sid'); // Clear session cookie
            res.status(200).json({ message: 'Logged out successfully' });
        });
    });
});
// PATCH /auth/update-username - Update username
router.patch('/update-username', async (req, res) => {
    try {
        const userId = req.user?._id;
        const { newUsername, currentPassword } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Check if username is already taken
        const existingUser = await User.findOne({ username: newUsername });
        if (existingUser && existingUser._id.toString() !== userId.toString()) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        // Update username
        user.username = newUsername;
        await user.save();

        res.status(200).json({ message: 'Username updated successfully' });
    } catch (error) {
        console.error('Error updating username:', error);
        res.status(500).json({ message: 'Failed to update username' });
    }
});

router.patch('/update-password', async (req, res) => {
    try {
        const userId = req.user?._id;
        const { currentPassword, newPassword } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Use the new setPassword method instead of directly setting the password
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Failed to update password' });
    }
});
export default router;
