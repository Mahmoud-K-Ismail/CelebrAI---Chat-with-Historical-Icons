// import React, { useState } from 'react';
// import './App.css';
//
// function App() {
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
//         <div className="App">
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
// export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Chat from './Chat';
import Register from './Register';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <nav>
                    <ul>
                        <li><Link to="/">Chat</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </ul>
                </nav>

                <Routes>
                    <Route path="/" element={<Chat />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
