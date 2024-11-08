// import express from 'express';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// import connectDB from './db.js';
// import session from 'express-session';
// import passport from './config/passport.js';
// import authRoutes from './routes/auth.js';
// import chatRoutes from './routes/chat.js';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import redis from 'redis';
// const redisClient = redis.createClient();
// import bodyParser from 'body-parser';
// import axios from 'axios'; // Use axios for making requests to Gemini API
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
// // Initialize Gemini AI
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//
// // app.use(cors({ origin: 'http://linserv1.cims.nyu.edu:12173' })); // remove the curly brackets if not working
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(session({
//     secret: process.env.SESSION_SECRET || 'your_session_secret',
//     resave: false,
//     saveUninitialized: false
// }));
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(express.static('dist'));
// app.use('/auth', authRoutes);
// app.use('/chat', chatRoutes);
//
// // Root route
// app.get('/', (req, res) => {
//     res.send('Welcome to ShakespeareGPT!');
// });
//
// // Gemini API chat route
// // app.post('/api/chat', async (req, res) => {
// //     try {
// //         const { message } = req.body;
// //         const model = genAI.getGenerativeModel({ model: "gemini-pro" });
// //         const result = await model.generateContent(message);
// //         const response = await result.response;
// //         const text = response.text();
// //         res.json({ reply: text });
// //     } catch (error) {
// //         res.status(500).json({ error: error.message });
// //     }
// // });
//
//
//
// app.post('/api/chat', async (req, res) => {
//     try {
//         const { message } = req.body;
//         const cacheKey = `shakespeare:${message}`;
//
//         // Check if response is cached
//         redisClient.get(cacheKey, async (err, cachedResponse) => {
//             if (err) throw err;
//
//             if (cachedResponse) {
//                 // If cached, return the cached response
//                 return res.json({ reply: cachedResponse });
//             } else {
//                 // Create Shakespeare prompt
//                 const shakespearePrompt = `Pretend you are William Shakespeare. Respond in his style. Here is the question: "${message}"`;
//
//                 // Generate response using the Gemini model
//                 const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//                 const result = await model.generateContent(shakespearePrompt);
//                 const response = await result.response;
//                 const text = await response.text();
//
//                 // Cache the response
//                 redisClient.setex(cacheKey, 3600, text); // Cache for 1 hour
//
//                 // Send the response back
//                 res.json({ reply: text });
//             }
//         });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: error.message });
//     }
// });
//
//
// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });

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
import cors from 'cors';
import mongoose from 'mongoose';

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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('dist'));
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);

// Handle frontend routes (all unmatched routes should be served by index.html)
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
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
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});