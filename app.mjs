import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import connectDB from './db.js';
import session from 'express-session';
import passport from './config/passport.js';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// JSON and URL-encoded parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'shakespearegpt-frontend/dist')));

// API Routes
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);

// Handle frontend routes (React fallback for SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'shakespearegpt-frontend/dist', 'index.html'));
});

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to ShakespeareGPT!');
});

// Gemini API chat route
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();
        res.json({ reply: text });
    } catch (error) {
        console.error(`[Gemini API Error] ${error.message}`); // Add error logging
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
