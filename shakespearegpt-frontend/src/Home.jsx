import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="App">
            <h1>Welcome to ShakespeareGPT</h1>
            <div>
                <Link to="/register">Register</Link> | <Link to="/login">Login</Link>
            </div>
        </div>
    );
};

export default Home;
