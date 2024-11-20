import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Register from './Register';
import Chat from './Chat';
import Profile from './Profile';

const App = () => {
    const API = import.meta.env.VITE_BACKEND_URL; // Ensure this is correctly defined in .env
    console.log('API URL:', API); // Debugging log

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home apiUrl={API} />} />
                    <Route path="/register" element={<Register apiUrl={API} />} />
                    <Route path="/login" element={<Home apiUrl={API} />} />
                    <Route path="/chat" element={<Chat apiUrl={API} />} />
                    <Route path="/profile" element={<Profile apiUrl={API} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
