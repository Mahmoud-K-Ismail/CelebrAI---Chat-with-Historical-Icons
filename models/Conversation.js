import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    isUser: { type: Boolean, required: true },
    timestamp: { type: Date, default: Date.now }
});

const ConversationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    character: { type: String, required: true },
    messages: [MessageSchema],
    createdAt: { type: Date, default: Date.now }
});

const Conversation = mongoose.model('Conversation', ConversationSchema);

export default Conversation;
