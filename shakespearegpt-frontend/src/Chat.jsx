// export default Chat;
import React, { useState, useEffect } from 'react';
import './Chat.css';

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messagesCache, setMessagesCache] = useState({});
    const [history, setHistory] = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [loading, setLoading] = useState(false); // Track typing indicator

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                console.log('Fetching chat history...');
                const response = await fetch('/chat/history', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Chat history fetched successfully:', data);

                    setHistory(data.history);

                    // Ensure there is at least one conversation
                    if (data.history.length > 0) {
                        const firstConversation = data.history[0];
                        console.log('Setting first conversation as active:', firstConversation);

                        setActiveConversationId(firstConversation._id);
                        setMessagesCache((prev) => ({
                            ...prev,
                            [firstConversation._id]: firstConversation.messages,
                        }));
                    } else {
                        console.log('No conversations found.');
                    }
                } else {
                    console.error('Failed to fetch chat history:', response.status);
                }
            } catch (err) {
                console.error('Error fetching chat history:', err);
            }
        };
        fetchHistory();
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        const trimmedMessage = message.trim();

        if (!trimmedMessage || !activeConversationId) {
            alert('Please enter a message.');
            return;
        }

        console.log('Sending message:', trimmedMessage, 'to conversation:', activeConversationId);

        // Immediately display the user's message
        const userMessage = { content: trimmedMessage, isUser: true };
        setMessagesCache((prev) => ({
            ...prev,
            [activeConversationId]: [...(prev[activeConversationId] || []), userMessage],
        }));
        setMessage('');
        setLoading(true); // Show typing indicator

        try {
            const response = await fetch('/chat/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ conversationId: activeConversationId, message: trimmedMessage }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('AI response received:', data.reply);

                const aiMessage = { content: data.reply, isUser: false };
                setMessagesCache((prev) => ({
                    ...prev,
                    [activeConversationId]: [...(prev[activeConversationId] || []), aiMessage],
                }));
            } else {
                const errorData = await response.json();
                console.error('Error sending message:', errorData.message);
                alert(`Failed to send message: ${errorData.message}`);
            }
        } catch (err) {
            console.error('Error sending message:', err);
            alert('An error occurred while sending the message. Please try again.');
        } finally {
            setLoading(false); // Remove typing indicator
        }
    };

    const handleStartNewChat = async () => {
        try {
            console.log('Starting a new conversation...');
            const response = await fetch('/chat/start', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                const newConversation = await response.json();
                console.log('New conversation started:', newConversation);

                setHistory((prevHistory) => [newConversation, ...prevHistory]);
                setActiveConversationId(newConversation._id);
                setMessagesCache((prev) => ({
                    ...prev,
                    [newConversation._id]: [], // Initialize messages for the new chat
                }));
            } else {
                console.error('Failed to start a new chat:', response.status);
                alert('Failed to start a new chat.');
            }
        } catch (err) {
            console.error('Error starting new chat:', err);
        }
    };

    const loadConversation = (conversation) => {
        console.log('Loading conversation:', conversation);

        // Set the active conversation ID
        setActiveConversationId(conversation._id);

        // Check if the messages for this conversation are already in the cache
        if (!messagesCache[conversation._id]) {
            console.log('Messages not in cache. Loading from history.');
            setMessagesCache((prev) => ({
                ...prev,
                [conversation._id]: conversation.messages, // Load messages from the conversation
            }));
        }

        console.log('Updated messagesCache:', messagesCache);
    };

    const deleteConversation = async (conversationId) => {
        try {
            console.log('Deleting conversation:', conversationId);
            const response = await fetch(`/chat/delete/${conversationId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                console.log('Conversation deleted successfully:', conversationId);
                setHistory((prevHistory) => prevHistory.filter((conv) => conv._id !== conversationId));
                if (activeConversationId === conversationId) {
                    console.log('Deleted active conversation. Clearing active state.');
                    setActiveConversationId(null);
                    setMessagesCache((prev) => {
                        const updatedCache = { ...prev };
                        delete updatedCache[conversationId];
                        return updatedCache;
                    });
                }
            } else {
                console.error('Failed to delete conversation:', response.status);
                alert('Failed to delete conversation.');
            }
        } catch (err) {
            console.error('Error deleting conversation:', err);
        }
    };

    const handleLogout = async () => {
        try {
            console.log('Logging out...');
            const response = await fetch('/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok) {
                console.log('Logout successful. Redirecting to login...');
                window.location.href = '/login';
            } else {
                console.error('Logout failed:', response.status);
                alert('Logout failed!');
            }
        } catch (err) {
            console.error('Error logging out:', err);
        }
    };

    const toggleDropdown = () => {
        setDropdownVisible((prev) => !prev);
    };

    const messages = messagesCache[activeConversationId] || [];

    return (
        <div className="chat-page">
            <div className="header">
                <div className="user-menu" onClick={toggleDropdown}>
                    <span className="user-icon">👤</span>
                    {dropdownVisible && (
                        <div className="dropdown">
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="sidebar">
                <h3>Chat History</h3>
                <button onClick={handleStartNewChat} className="new-chat-button">Start New Chat</button>
                {history.map((conv, index) => (
                    <div
                        onClick={() => loadConversation(conv)}
                        key={index}
                        className={`history-item ${conv._id === activeConversationId ? 'active' : ''}`}
                    >
                        <span>{conv.character || `Conversation ${index + 1}`}</span>
                        <button onClick={() => deleteConversation(conv._id)} className="delete-button">🗑️</button>
                    </div>
                ))}
            </div>

            <div className="chat-container">
                <div className="messages">
                    {loading && <div className="message bot"><em>Typing...</em></div>}
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.isUser ? 'user' : 'bot'}`}>
                            {msg.content}
                        </div>
                    )).reverse()}
                </div>
                <form onSubmit={handleSend}>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        disabled={!activeConversationId}
                    />
                    <button type="submit" disabled={!activeConversationId || loading}>
                        {loading ? 'Sending...' : 'Send'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
