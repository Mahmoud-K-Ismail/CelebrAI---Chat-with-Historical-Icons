// import React, { useState, useEffect } from 'react';
// import './Chat.css';
//
// const Chat = () => {
//     const [message, setMessage] = useState('');
//     const [messagesCache, setMessagesCache] = useState({});
//     const [history, setHistory] = useState([]);
//     const [activeConversationId, setActiveConversationId] = useState(null);
//     const [dropdownVisible, setDropdownVisible] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [editingConversationId, setEditingConversationId] = useState(null);
//
//     useEffect(() => {
//         const fetchHistory = async () => {
//             try {
//                 const response = await fetch('/chat/history', {
//                     method: 'GET',
//                     credentials: 'include',
//                 });
//
//                 if (response.ok) {
//                     const data = await response.json();
//                     setHistory(data.history);
//
//                     if (data.history.length > 0) {
//                         const firstConversation = data.history[0];
//                         setActiveConversationId(firstConversation._id);
//                         setMessagesCache((prev) => ({
//                             ...prev,
//                             [firstConversation._id]: firstConversation.messages,
//                         }));
//                     }
//                 } else {
//                     console.error('Failed to fetch chat history:', response.status);
//                 }
//             } catch (err) {
//                 console.error('Error fetching chat history:', err);
//             }
//         };
//         fetchHistory();
//     }, []);
//
//     const handleSend = async (e) => {
//         e.preventDefault();
//         const trimmedMessage = message.trim();
//
//         if (!trimmedMessage || !activeConversationId) {
//             alert('Please enter a message.');
//             return;
//         }
//
//         const userMessage = { content: trimmedMessage, isUser: true };
//         setMessagesCache((prev) => ({
//             ...prev,
//             [activeConversationId]: [...(prev[activeConversationId] || []), userMessage],
//         }));
//         setMessage('');
//         setLoading(true);
//
//         try {
//             const response = await fetch('/chat/message', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 credentials: 'include',
//                 body: JSON.stringify({ conversationId: activeConversationId, message: trimmedMessage }),
//             });
//
//             if (response.ok) {
//                 const data = await response.json();
//                 const aiMessage = { content: data.reply, isUser: false };
//                 setMessagesCache((prev) => ({
//                     ...prev,
//                     [activeConversationId]: [...(prev[activeConversationId] || []), aiMessage],
//                 }));
//             } else {
//                 const errorData = await response.json();
//                 alert(`Failed to send message: ${errorData.message}`);
//             }
//         } catch (err) {
//             console.error('Error sending message:', err);
//             alert('An error occurred while sending the message. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleStartNewChat = async () => {
//         try {
//             const response = await fetch('/chat/start', {
//                 method: 'POST',
//                 credentials: 'include',
//             });
//
//             if (response.ok) {
//                 const newConversation = await response.json();
//                 setHistory((prevHistory) => [newConversation, ...prevHistory]);
//                 setActiveConversationId(newConversation._id);
//                 setMessagesCache((prev) => ({
//                     ...prev,
//                     [newConversation._id]: [],
//                 }));
//             } else {
//                 alert('Failed to start a new chat.');
//             }
//         } catch (err) {
//             console.error('Error starting new chat:', err);
//         }
//     };
//
//     const loadConversation = (conversation) => {
//         setActiveConversationId(conversation._id);
//
//         if (!messagesCache[conversation._id]) {
//             setMessagesCache((prev) => ({
//                 ...prev,
//                 [conversation._id]: conversation.messages,
//             }));
//         }
//     };
//
//     const deleteConversation = async (conversationId) => {
//         try {
//             const response = await fetch(`/chat/delete/${conversationId}`, {
//                 method: 'DELETE',
//                 credentials: 'include',
//             });
//
//             if (response.ok) {
//                 setHistory((prevHistory) => prevHistory.filter((conv) => conv._id !== conversationId));
//                 if (activeConversationId === conversationId) {
//                     setActiveConversationId(null);
//                     setMessagesCache((prev) => {
//                         const updatedCache = { ...prev };
//                         delete updatedCache[conversationId];
//                         return updatedCache;
//                     });
//                 }
//             } else {
//                 alert('Failed to delete conversation.');
//             }
//         } catch (err) {
//             console.error('Error deleting conversation:', err);
//         }
//     };
//
//     const handleEditName = (conversationId) => {
//         setEditingConversationId(conversationId);
//     };
//
//     const handleUpdateName = async (conversationId, newName) => {
//         setEditingConversationId(null);
//         if (newName.trim() === '') {
//             alert('Conversation name cannot be empty.');
//             return;
//         }
//
//         try {
//             const response = await fetch(`/chat/update/${conversationId}`, {
//                 method: 'PATCH',
//                 headers: { 'Content-Type': 'application/json' },
//                 credentials: 'include',
//                 body: JSON.stringify({ character: newName.trim() }),
//             });
//
//             if (response.ok) {
//                 const updatedConversation = await response.json();
//                 setHistory((prevHistory) =>
//                     prevHistory.map((conv) =>
//                         conv._id === conversationId ? { ...conv, character: updatedConversation.character } : conv
//                     )
//                 );
//             } else {
//                 console.error('Failed to update conversation name.');
//             }
//         } catch (err) {
//             console.error('Error updating conversation name:', err);
//         }
//     };
//
//     const toggleDropdown = () => {
//         setDropdownVisible((prev) => !prev);
//     };
//
//     const parseMessageContent = (content) => {
//         const formattedContent = content
//             .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
//             .replace(/\*(.*?)\*/g, '<em>$1</em>')
//             .replace(/`(.*?)`/g, '<code>$1</code>')
//             .replace(/\n/g, '<br>');
//
//         return <span dangerouslySetInnerHTML={{ __html: formattedContent }} />;
//     };
//
//     const messages = messagesCache[activeConversationId] || [];
//
//     return (
//         <div className="chat-page">
//             <div className="header">
//                 <div className="user-menu" onClick={toggleDropdown}>
//                     <span className="user-icon">👤</span>
//                     {dropdownVisible && (
//                         <div className="dropdown">
//                             <button onClick={handleLogout}>Logout</button>
//                         </div>
//                     )}
//                 </div>
//             </div>
//             <div className="sidebar">
//                 <h3>Chat History</h3>
//                 <button onClick={handleStartNewChat} className="new-chat-button">Start New Chat</button>
//                 {history.map((conv, index) => (
//                     <div
//                         key={conv._id}
//                         className={`history-item ${conv._id === activeConversationId ? 'active' : ''}`}
//                         onClick={() => loadConversation(conv)}
//                     >
//                         {editingConversationId === conv._id ? (
//                             <input
//                                 type="text"
//                                 defaultValue={conv.character}
//                                 onBlur={(e) => handleUpdateName(conv._id, e.target.value)}
//                                 autoFocus
//                                 onKeyDown={(e) => {
//                                     if (e.key === 'Enter') {
//                                         handleUpdateName(conv._id, e.target.value);
//                                     }
//                                 }}
//                             />
//                         ) : (
//                             <span>{conv.character || `Conversation ${index + 1}`}</span>
//                         )}
//                         <button
//                             onClick={(e) => {
//                                 e.stopPropagation(); // Prevent triggering loadConversation
//                                 handleEditName(conv._id);
//                             }}
//                             className="edit-button"
//                         >
//                             ✏️
//                         </button>
//                         <button
//                             onClick={(e) => {
//                                 e.stopPropagation(); // Prevent triggering loadConversation
//                                 deleteConversation(conv._id);
//                             }}
//                             className="delete-button"
//                         >
//                             🗑️
//                         </button>
//                     </div>
//                 ))}
//             </div>
//
//             <div className="chat-container">
//                 <div className="messages">
//                     {loading && <div className="message bot"><em>Typing...</em></div>}
//                     {messages.map((msg, index) => (
//                         <div key={index} className={`message ${msg.isUser ? 'user' : 'bot'}`}>
//                             {msg.isUser ? msg.content : parseMessageContent(msg.content)}
//                         </div>
//                     )).reverse()}
//                 </div>
//                 <form onSubmit={handleSend}>
//                     <input
//                         type="text"
//                         value={message}
//                         onChange={(e) => setMessage(e.target.value)}
//                         placeholder="Type your message..."
//                         disabled={!activeConversationId}
//                     />
//                     <button type="submit" disabled={!activeConversationId || loading}>
//                         {loading ? 'Sending...' : 'Send'}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };
//
// export default Chat;
import React, { useState, useEffect } from 'react';
import './Chat.css';

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messagesCache, setMessagesCache] = useState({});
    const [history, setHistory] = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingConversationId, setEditingConversationId] = useState(null);
    const [editingValue, setEditingValue] = useState(''); // State to track the input value while editing

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

        const userMessage = { content: trimmedMessage, isUser: true };
        setMessagesCache((prev) => ({
            ...prev,
            [activeConversationId]: [...(prev[activeConversationId] || []), userMessage],
        }));
        setMessage('');
        setLoading(true);

        try {
            const response = await fetch('/chat/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ conversationId: activeConversationId, message: trimmedMessage }),
            });

            if (response.ok) {
                const data = await response.json();
                const aiMessage = { content: data.reply, isUser: false };
                setMessagesCache((prev) => ({
                    ...prev,
                    [activeConversationId]: [...(prev[activeConversationId] || []), aiMessage],
                }));
            } else {
                const errorData = await response.json();
                alert(`Failed to send message: ${errorData.message}`);
            }
        } catch (err) {
            console.error('Error sending message:', err);
            alert('An error occurred while sending the message. Please try again.');
        } finally {
            setLoading(false);
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
                setHistory((prevHistory) => [newConversation, ...prevHistory]);
                setActiveConversationId(newConversation._id);
                setMessagesCache((prev) => ({
                    ...prev,
                    [newConversation._id]: [],
                }));
            } else {
                alert('Failed to start a new chat.');
            }
        } catch (err) {
            console.error('Error starting new chat:', err);
        }
    };

    const loadConversation = (conversation) => {
        setActiveConversationId(conversation._id);

        if (!messagesCache[conversation._id]) {
            setMessagesCache((prev) => ({
                ...prev,
                [conversation._id]: conversation.messages,
            }));
        }
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

    const handleEditName = (conversation) => {
        setEditingConversationId(conversation._id);
        setEditingValue(conversation.character); // Set the initial input value to the current conversation name
    };

    const handleLogout = async () => {
        try {
            console.log('Attempting to log out...');
            const response = await fetch('/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                console.log('Logout successful. Redirecting to login...');
                window.location.href = '/login';
            } else {
                const errorData = await response.json();
                console.error('Logout failed:', errorData.message || response.statusText);
                alert(`Logout failed: ${errorData.message || 'Unexpected error'}`);
            }
        } catch (err) {
            console.error('Error logging out:', err);
            alert('An error occurred while logging out.');
        }
    };

    const handleUpdateName = async (conversationId, newName) => {
        if (newName.trim() === '') {
            alert('Conversation name cannot be empty.');
            return;
        }

        setEditingConversationId(null); // Close the editing input field

        try {
            const response = await fetch(`/chat/update/${conversationId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ character: newName.trim() }),
            });

            if (response.ok) {
                const updatedConversation = await response.json(); // Directly get the updated conversation object

                // Update the `history` state dynamically with the updated character name
                setHistory((prevHistory) =>
                    prevHistory.map((conv) =>
                        conv._id === conversationId
                            ? { ...conv, character: updatedConversation.character }
                            : conv
                    )
                );

                console.log(`Conversation ${conversationId} updated to name: ${updatedConversation.character}`);
            } else {
                console.error('Failed to update conversation name.');
            }
        } catch (err) {
            console.error('Error updating conversation name:', err);
        }
    };

    const toggleDropdown = () => {
        setDropdownVisible((prev) => !prev);
    };

    const parseMessageContent = (content) => {
        const formattedContent = content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');

        return <span dangerouslySetInnerHTML={{ __html: formattedContent }} />;
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
                {history.map((conv) => (
                    <div
                        key={conv._id}
                        className={`history-item ${conv._id === activeConversationId ? 'active' : ''}`}
                        onClick={() => loadConversation(conv)}
                    >
                        {editingConversationId === conv._id ? (
                            <input
                                type="text"
                                value={editingValue} // Controlled input value
                                onChange={(e) => setEditingValue(e.target.value)} // Update input field
                                onBlur={() => handleUpdateName(conv._id, editingValue)} // Save on blur
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleUpdateName(conv._id, editingValue); // Save on Enter
                                    }
                                }}
                            />
                        ) : (
                            <span>{conv.character || 'Unnamed Conversation'}</span>
                        )}

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEditName(conv);
                            }}
                            className="edit-button"
                        >
                            ✏️
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteConversation(conv._id);
                            }}
                            className="delete-button"
                        >
                            🗑️
                        </button>
                    </div>
                ))}
            </div>

            <div className="chat-container">
                <div className="messages">
                    {loading && <div className="message bot"><em>Typing...</em></div>}
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.isUser ? 'user' : 'bot'}`}>
                            {msg.isUser ? msg.content : parseMessageContent(msg.content)}
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
