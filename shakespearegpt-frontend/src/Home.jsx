import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'; // Import PropTypes

const Home = ({ apiUrl }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('Login attempt:', { username }); // Debugging log

        try {
            const response = await fetch(`${apiUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();

            console.log('Login response:', data); // Debugging log
            if (response.ok) {
                setMessage('Login successful!');
                window.location.href = '/chat'; // Redirect to chat
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error('Error during login:', error.message); // Debugging log
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <h1>Welcome to ShakespeareGPT</h1>
            <p>Navigate to:</p>
            <ul>
                <li><Link to="/register">Register Page</Link></li>
                <li><Link to="/chat">Chat Page</Link></li>
            </ul>
            <hr />
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

// Define prop types
Home.propTypes = {
    apiUrl: PropTypes.string.isRequired,
};

export default Home;
