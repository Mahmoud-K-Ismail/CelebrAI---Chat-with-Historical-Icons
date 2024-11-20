import { useState } from 'react';
import LoginForm from './LoginForm';

const Login = ({ apiUrl }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('Login attempt:', { username, password }); // Debugging log

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
                // Redirect to chat page or set logged-in state
                window.location.href = '/chat';
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error('Error during login:', error.message); // Debugging log
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <LoginForm
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
            handleLogin={handleLogin}
            message={message}
        />
    );
};

export default Login;
