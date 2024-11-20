import express from 'express';
import User from '../models/User.js'; // Replace with your User model path
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        console.log('Registration request received:', req.body); // Debugging log

        const { username, password } = req.body;

        // Check if username exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log(`Username already exists: ${username}`); // Debugging log
            return res.status(400).json({ message: 'Username already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({ username, password: hashedPassword });
        await user.save();

        console.log(`User registered successfully: ${username}`); // Debugging log
        res.status(201).json({ message: 'Registration successful! Please log in.' });
    } catch (error) {
        console.error('Error during registration:', error.message); // Debugging log
        res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
});
router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt for username:', username); // Debugging log

        const user = await User.findOne({ username });
        if (!user) {
            console.warn('User not found:', username); // Debugging log
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            console.warn('Password mismatch for user:', username); // Debugging log
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        req.login(user, (err) => {
            if (err) {
                console.error('Error during login:', err.message); // Debugging log
                return res.status(500).json({ message: 'Login failed. Please try again.' });
            }
            console.log('Login successful for user:', username); // Debugging log
            res.status(200).json({ message: 'Login successful!' });
        });
    } catch (error) {
        console.error('Error during login:', error.message); // Debugging log
        res.status(500).json({ message: 'Login failed. Please try again.' });
    }
});


export default router;
