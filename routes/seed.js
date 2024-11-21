import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Conversation from '../models/Conversation.js';

dotenv.config();
mongoose.connect("mongodb+srv://testuser:TestPassword123@finalprojectait.s57ke.mongodb.net/shakespearegpt?retryWrites=true&w=majority&appName=finalProjectAIT", { useNewUrlParser: true, useUnifiedTopology: true });

const seedDatabase = async () => {
    try {
        // Find a user (replace with your test user or create one)
        const user = await User.findOne({ username: 'mkassem' });
        if (!user) {
            console.error('No user found. Please register a user first.');
            process.exit(1);
        }

        // Seed example conversations
        const conversation = new Conversation({
            user: user._id,
            character: 'Gemini Bot',
            messages: [
                { content: 'Hello, Gemini!', isUser: true },
                { content: 'Hi! How can I help you today?', isUser: false },
                { content: 'What is the weather like?', isUser: true },
                { content: 'It looks sunny today!', isUser: false },
            ],
        });

        await conversation.save();
        console.log('Database seeded with conversation history.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
