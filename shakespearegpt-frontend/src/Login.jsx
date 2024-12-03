import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importing Bootstrap
import './App.css'; // Import the CSS styles
import { Link } from 'react-router-dom'; // Import Link from react-router-dom for navigation

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                navigate('/chat');
            } else {
                alert('Login failed!');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="App">
            <form className="login-container" onSubmit={handleSubmit}>
                <h2>Login to CelebrAI</h2>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                />
                <button type="submit">Login</button>

                {/* Register link */}
                <div className="register-link">
                    <p>Don't have an account? <Link to="/register">Register Now!</Link></p>
                </div>
            </form>
        </div>
    );
};

export default Login;
