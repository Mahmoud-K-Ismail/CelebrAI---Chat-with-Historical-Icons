// import React, { useState } from 'react';
//
// function Chat() {
//     const [input, setInput] = useState('');
//     const [messages, setMessages] = useState([]);
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setMessages([...messages, { text: input, user: true }]);
//         setInput('');
//
//         try {
//             const response = await fetch('/api/chat', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ message: input }),
//             });
//             const data = await response.json();
//             setMessages([...messages, { text: input, user: true }, { text: data.reply, user: false }]);
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     };
//
//     return (
//         <div>
//             <h1>ShakespeareGPT Chat</h1>
//             <div className="chat-container">
//                 {messages.map((message, index) => (
//                     <div key={index} className={`message ${message.user ? 'user' : 'bot'}`}>
//                         {message.text}
//                     </div>
//                 ))}
//             </div>
//             <form onSubmit={handleSubmit}>
//                 <input
//                     type="text"
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     placeholder="Type your message..."
//                 />
//                 <button type="submit">Send</button>
//             </form>
//         </div>
//     );
// }
//
// export default Chat;

// Chat.jsx
import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_BACKEND_URL;

const Chat = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Example API call to fetch chat messages
        const fetchMessages = async () => {
            try {
                const response = await fetch(`${API}/api/chat`);
                const data = await response.json();
                setMessages(data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, []);

    return (
        <div>
            {messages.map((msg, index) => (
                <p key={index}>{msg.content}</p>
            ))}
        </div>
    );
};

export default Chat;
