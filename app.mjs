import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import connectDB from './db.js';
import session from 'express-session';
import passport from './config/passport.js';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';

connectDB();


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_session_secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRoutes);
app.use(express.static('public'));
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to ShakespeareGPT!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
