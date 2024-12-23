import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importing Bootstrap
import './App.css'; // Import the CSS for dynamic styling

const Home = () => {
    useEffect(() => {
        const handleMouseMove = (e) => {
            document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
            document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="App">
            <div className="dynamic-background"></div>
            <div className="container home-container">
                <h1>Welcome to CelebrAI</h1>
                <div className="link-container">
                    <Link to="/register" className="btn btn-primary">Register</Link>
                    <Link to="/login" className="btn btn-secondary">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
