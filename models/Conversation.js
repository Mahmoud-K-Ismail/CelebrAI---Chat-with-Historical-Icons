import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
    {
        content: { type: String, required: true },
        isUser: { type: Boolean, required: true },
    },
    { timestamps: true }
);

const ConversationSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        character: { type: String, default: 'Gemini Bot' },
        messages: [MessageSchema], // Define messages as an array of MessageSchema
    },
    { timestamps: true }
);

export default mongoose.model('Conversation', ConversationSchema);
