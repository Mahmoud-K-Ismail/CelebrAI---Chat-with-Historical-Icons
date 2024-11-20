import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Register from './Register';
import Chat from './Chat';
import Login from './Login';

const App = () => {
    const API = import.meta.env.VITE_BACKEND_URL;
    console.log('API URL:', API); // Debugging log

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register apiUrl={API} />} />
                    <Route path="/login" element={<Login apiUrl={API} />} />
                    <Route path="/chat" element={<Chat apiUrl={API} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
