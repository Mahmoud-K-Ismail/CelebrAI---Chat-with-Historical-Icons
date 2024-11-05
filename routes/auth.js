import express from 'express';
import User from '../models/User.js';
import passport from 'passport';


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

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.json({ message: 'Login successful', user: req.user });
});

router.get('/logout', (req, res) => {
    req.logout();
    res.json({ message: 'Logout successful' });
});

export default router;
