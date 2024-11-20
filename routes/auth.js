import express from 'express';
import User from '../models/User.js'; // Replace with your User model path
import bcrypt from 'bcrypt';


const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log('Registration attempt:', { username, password }); // Debugging log

        // Create a new user
        const user = new User({ username, password });
        console.log('Saving user to database:', { username }); // Debugging log
        await user.save();

        console.log('User registered successfully:', { username }); // Debugging log
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration failed:', error.message); // Debugging log
        res.status(400).json({ message: 'Registration failed', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log('Login attempt for username:', username); // Debugging log

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            console.warn('User not found:', username); // Debugging log
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        console.log('Stored password in database:', user.password); // Debugging log
        console.log('Input password (plaintext):', password); // Debugging log

        // Temporarily hash the input password for comparison/debugging
        const hashedInputPassword = await bcrypt.hash(password, 10);
        console.log('Hashed input password (for debug purposes only):', hashedInputPassword); // Debugging log

        // Compare passwords
        console.log('Comparing passwords for user:', username); // Debugging log
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        console.log('Password comparison result:', isPasswordMatch); // Debugging log

        if (!isPasswordMatch) {
            console.warn('Password mismatch for user:', username); // Debugging log
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        console.log('Login successful for user:', username); // Debugging log
        req.login(user, (err) => {
            if (err) {
                console.error('Error during login:', err.message); // Debugging log
                return res.status(500).json({ message: 'Login failed. Please try again.' });
            }
            res.status(200).json({ message: 'Login successful!' });
        });
    } catch (error) {
        console.error('Error during login:', error.message); // Debugging log
        res.status(500).json({ message: 'Login failed. Please try again.' });
    }
});

export default router;
