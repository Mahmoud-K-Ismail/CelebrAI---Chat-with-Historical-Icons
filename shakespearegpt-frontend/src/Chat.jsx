import React, { useState, useEffect } from 'react';
import './Chat.css';

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messagesCache, setMessagesCache] = useState({});
    const [history, setHistory] = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch('/chat/history', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    setHistory(data.history);
                    if (data.history.length > 0) {
                        const firstConversation = data.history[0];
                        setActiveConversationId(firstConversation._id);
                        setMessagesCache((prev) => ({
                            ...prev,
                            [firstConversation._id]: firstConversation.messages,
                        }));
                    }
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
        if (!trimmedMessage || !activeConversationId) return;

        try {
            const response = await fetch('/chat/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ message: trimmedMessage }),
            });

            if (response.ok) {
                const data = await response.json();
                const updatedMessages = [
                    ...(messagesCache[activeConversationId] || []),
                    { content: trimmedMessage, isUser: true },
                    { content: data.aiResponse, isUser: false },
                ];
                setMessagesCache((prev) => ({
                    ...prev,
                    [activeConversationId]: updatedMessages,
                }));
                setMessage('');
            }
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    const handleStartNewChat = async () => {
        try {
            const response = await fetch('/chat/start', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                const newConversation = await response.json();
                setHistory([newConversation, ...history]);
                setActiveConversationId(newConversation._id);
                setMessagesCache((prev) => ({
                    ...prev,
                    [newConversation._id]: [], // Initialize messages for the new chat
                }));
            }
        } catch (err) {
            console.error('Error starting new chat:', err);
        }
    };

    const loadConversation = (conversation) => {
        setActiveConversationId(conversation._id);
    };

    const deleteConversation = async (conversationId) => {
        try {
            const response = await fetch(`/chat/delete/${conversationId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                setHistory((prevHistory) => prevHistory.filter((conv) => conv._id !== conversationId));
                if (activeConversationId === conversationId) {
                    setActiveConversationId(null);
                    setMessagesCache((prev) => {
                        const updatedCache = { ...prev };
                        delete updatedCache[conversationId];
                        return updatedCache;
                    });
                }
            } else {
                alert('Failed to delete conversation.');
            }
        } catch (err) {
            console.error('Error deleting conversation:', err);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok) {
                window.location.href = '/login';
            } else {
                alert('Logout failed!');
            }
        } catch (err) {
            console.error('Error logging out:', err);
        }
    };

    const handleAccountSettings = () => {
        alert('Account Settings Coming Soon!');
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
                            <button onClick={handleAccountSettings}>Account Settings</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="sidebar">
                <h3>Chat History</h3>
                <button onClick={handleStartNewChat} className="new-chat-button">Start New Chat</button>
                {history.map((conv, index) => (
                    <div onClick={() => loadConversation(conv)}
                        key={index}
                        className={`history-item ${conv._id === activeConversationId ? 'active' : ''}`}
                    >
                        <span>
                            {conv.character || `Conversation ${index + 1}`}
                        </span>
                        <button onClick={() => deleteConversation(conv._id)} className="delete-button">🗑️</button>
                    </div>
                ))}
            </div>

            <div className="chat-container">
                <div className="messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.isUser ? 'user' : 'bot'}`}>
                            {msg.content}
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSend}>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        disabled={!activeConversationId}
                    />
                    <button type="submit" disabled={!activeConversationId}>Send</button>
                </form>
            </div>
        </div>
    );
};

export default Chat;