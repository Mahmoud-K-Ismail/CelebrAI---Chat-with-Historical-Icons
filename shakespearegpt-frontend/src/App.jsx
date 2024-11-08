import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './Register';
import Chat from './Chat';

// Use the environment variable to define your backend URL
const API = import.meta.env.VITE_BACKEND_URL;

const App = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/register" element={<Register apiUrl={API} />} />
                    <Route path="/chat" element={<Chat apiUrl={API} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
