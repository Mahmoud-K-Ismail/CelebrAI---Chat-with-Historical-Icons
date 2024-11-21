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

export default router;
