import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserSettings.css';

const UserSettings = () => {
    const [username, setUsername] = useState('');
    const [usernameCurrentPassword, setUsernameCurrentPassword] = useState('');
    const [passwordCurrentPassword, setPasswordCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleUsernameSubmit = async (e) => {
        e.preventDefault();
        if (!usernameCurrentPassword) {
            setError('Current password is required to change username');
            return;
        }

        try {
            const response = await fetch('/auth/update-username', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    newUsername: username,
                    currentPassword: usernameCurrentPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Username updated successfully');
                setError('');
                setUsername('');
                setUsernameCurrentPassword('');
            } else {
                setError(data.message || 'Failed to update username');
                setSuccess('');
            }
        } catch (err) {
            setError('An error occurred while updating username');
            setSuccess('');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (!passwordCurrentPassword) {
            setError('Current password is required to change password');
            return;
        }

        try {
            const response = await fetch('/auth/update-password', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    currentPassword: passwordCurrentPassword,
                    newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Password updated successfully');
                setError('');
                setPasswordCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setError(data.message || 'Failed to update password');
                setSuccess('');
            }
        } catch (err) {
            setError('An error occurred while updating password');
            setSuccess('');
        }
    };

    return (
        <div className="settings-container">
            <div className="settings-header">
                <button className="back-button" onClick={() => navigate('/chat')}>
                    ← Back to Chat
                </button>
                <h1>User Settings</h1>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="settings-section">
                <h2>Change Username</h2>
                <form onSubmit={handleUsernameSubmit}>
                    <div className="form-group">
                        <label>New Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            minLength="3"
                        />
                    </div>
                    <div className="form-group">
                        <label>Current Password:</label>
                        <input
                            type="password"
                            value={usernameCurrentPassword}
                            onChange={(e) => setUsernameCurrentPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Update Username</button>
                </form>
            </div>

            <div className="settings-section">
                <h2>Change Password</h2>
                <form onSubmit={handlePasswordSubmit}>
                    <div className="form-group">
                        <label>Current Password:</label>
                        <input
                            type="password"
                            value={passwordCurrentPassword}
                            onChange={(e) => setPasswordCurrentPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>New Password:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength="6"
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm New Password:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength="6"
                        />
                    </div>
                    <button type="submit">Update Password</button>
                </form>
            </div>
        </div>
    );
};

export default UserSettings;