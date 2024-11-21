import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import connectDB from './db.js';
import session from 'express-session';
import passport from './config/passport.js';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import profileRoutes from './routes/profile.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'shakespearegpt-frontend/dist')));

app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);
app.use('/profile', profileRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'shakespearegpt-frontend/dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
//
//
// import express from 'express';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// import connectDB from './db.js';
// import session from 'express-session';
// import passport from './config/passport.js';
// import authRoutes from './routes/auth.js';
// import chatRoutes from './routes/chat.js';
// import profileRoutes from './routes/profile.js';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import dotenv from 'dotenv';
// import path from 'path';
// import axios from 'axios';
//
// // Load environment variables from .env file
// dotenv.config();
//
// // Connect to MongoDB
// connectDB();
//
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
//
// const app = express();
// const port = process.env.PORT || 3000;
//
// // Initialize Google Generative AI with Gemini
// const genAI = new GoogleGenerativeAI({
//     apiKey: process.env.GEMINI_API_KEY, // Ensure the API key is in the .env file
// });
//
// // Middleware to log requests
// app.use((req, res, next) => {
//     console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//     next();
// });
//
// // Middleware to parse JSON and URL-encoded data
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
//
// // Session middleware for authentication
// app.use(
//     session({
//         secret: process.env.SESSION_SECRET || 'your_session_secret',
//         resave: false,
//         saveUninitialized: false,
//     })
// );
//
// // Passport middleware for authentication
// app.use(passport.initialize());
// app.use(passport.session());
//
// // Serve static frontend files
// app.use(express.static(path.join(__dirname, 'shakespearegpt-frontend/dist')));
//
// // API Routes
// app.use('/auth', authRoutes);
// app.use('/chat', chatRoutes);
// app.use('/profile', profileRoutes);
//
// // Handle generating Shakespearean responses via Gemini API
// app.post('/api/chat', async (req, res) => {
//     try {
//         const { message } = req.body;
//
//         if (!message || typeof message !== 'string') {
//             return res.status(400).json({ error: 'Invalid input message' });
//         }
//
//         const response = await axios.post(
//             'https://generativelanguage.googleapis.com/v1beta2/models/chat-bison:generateMessage',
//             {
//                 prompt: {
//                     context: "Reply in a Shakespearean tone.",
//                     examples: [],
//                     messages: [
//                         {
//                             author: 'user',
//                             content: message,
//                         },
//                     ],
//                 },
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
//                     'Content-Type': 'application/json',
//                 },
//             }
//         );
//
//         const botResponse = response.data?.candidates?.[0]?.content || 'No response from Gemini API';
//         res.json({ aiResponse: botResponse });
//     } catch (error) {
//         console.error(`[Gemini API Error] ${error.message}`);
//         res.status(500).json({ error: 'Failed to process message. Please try again.' });
//     }
// });
//
//
//
// // Handle frontend routes (React fallback for SPA)
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'shakespearegpt-frontend/dist', 'index.html'));
// });
//
// // Root route
// app.get('/', (req, res) => {
//     res.send('Welcome to ShakespeareGPT!');
// });
//
// // Start the server
// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });
