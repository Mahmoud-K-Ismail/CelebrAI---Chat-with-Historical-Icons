import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import connectDB from './db.js';
import session from 'express-session';
import passport from './config/passport.js';
import authRoutes, {checkAlreadyLoggedIn} from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import profileRoutes from './routes/profile.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { isAuthenticated } from './routes/auth.js';// Import the authentication middleware
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

app.use(express.static(path.join(__dirname, 'frontend/dist')));

app.use('/auth', authRoutes);
app.use('/chat', isAuthenticated, chatRoutes);  // Protect the chat route
app.use('/profile', isAuthenticated, profileRoutes);  // Protect the profile route
app.use('/settings', isAuthenticated, profileRoutes);  // Protect the profile route

app.use('/register', checkAlreadyLoggedIn, profileRoutes);  // Protect the profile route
app.use('/login', checkAlreadyLoggedIn, profileRoutes);  // Protect the profile route

app.get('/status', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
export default app;