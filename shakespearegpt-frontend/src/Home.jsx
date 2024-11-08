// src/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <h1>Welcome to ShakespeareGPT</h1>

            <div style={{ marginTop: '20px' }}>
                <h2>Navigate to:</h2>
                <ul>
                    <li>
                        <Link to="/register">Register Page</Link>
                    </li>
                    <li>
                        <Link to="/chat">Chat Page</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Home;
