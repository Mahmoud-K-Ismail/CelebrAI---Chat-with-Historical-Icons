import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import './Chat.css';

function Chat({ apiUrl }) {
    console.log('API URL in Chat:', apiUrl); // Debugging log

    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [chatHistory, setChatHistory] = useState([]);

    // Fetch chat history on component load
    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                console.log('Fetching chat history from:', `${apiUrl}/chat/history`); // Debugging log
                const response = await fetch(`${apiUrl}/chat/history`, {
                    method: 'GET',
                    credentials: 'include', // Include session cookies
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch chat history');
                }

                const data = await response.json();
                console.log('Chat history fetched:', data.history); // Debugging log

                // Transform history into a flat message array
                const historyMessages = data.history.flatMap((conversation) =>
                    conversation.messages.map((msg) => ({
                        text: msg.content,
                        user: msg.isUser,
                    }))
                );

                setMessages(historyMessages);
            } catch (error) {
                console.error('Error fetching chat history:', error.message); // Debugging log
            }
        };

        fetchChatHistory();
    }, [apiUrl]);

    // Handle message submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const userMessage = input; // Save the user's message
        setInput(''); // Clear input field

        // Add user message to state
        setMessages((prevMessages) => [...prevMessages, { text: userMessage, user: true }]);

        try {
            console.log('Sending message:', userMessage); // Debugging log

            const response = await fetch(`${apiUrl}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response from the server');
            }

            const data = await response.json();
            console.log('Received response from API:', data); // Debugging log

            // Add AI response to state
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: data.reply, user: false },
            ]);
        } catch (error) {
            console.error('Error sending message:', error.message); // Debugging log
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: 'Error: Unable to get a response.', user: false },
            ]);
        }
    };


    const handleLogout = () => {
        console.log('Logging out user'); // Debugging log
        window.location.href = '/'; // Redirect to home page
    };

    return (
        <div>
            <h1>ShakespeareGPT Chat</h1>
            <button onClick={handleLogout} style={{ marginBottom: '10px' }}>
                Logout
            </button>

            <div>
                <h2>Chat History</h2>
                {chatHistory.map((conversation, index) => (
                    <div key={conversation.id}>
                        <h3>{`Conversation with ${conversation.character}`}</h3>
                        <ul>
                            {conversation.messages.map((msg, msgIndex) => (
                                <li key={msgIndex} className={msg.isUser ? 'user' : 'bot'}>
                                    {msg.content} <span>({new Date(msg.timestamp).toLocaleString()})</span>
                                </li>
                            ))}
                        </ul>
                        <hr />
                    </div>
                ))}
            </div>

            <div className="chat-container">
                <h2>Current Conversation</h2>
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.user ? 'user' : 'bot'}`}>
                        {message.text}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

Chat.propTypes = {
    apiUrl: PropTypes.string.isRequired, // Add prop validation
};

export default Chat;
