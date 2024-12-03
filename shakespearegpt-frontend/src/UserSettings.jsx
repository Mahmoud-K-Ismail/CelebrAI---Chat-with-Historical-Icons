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
        <div className="settings-page">
            <div className="container settings-container">
                <div className="settings-header row justify-content-between align-items-center mb-4">
                    <button className="back-button btn btn-link" onClick={() => navigate('/chat')}>
                        ← Back to Chat
                    </button>
                    <h1 className="col-12 text-center">User Settings</h1>
                </div>

                {error && <div className="error-message alert alert-danger">{error}</div>}
                {success && <div className="success-message alert alert-success">{success}</div>}

                {/* Username Change Section */}
                <div className="settings-section username-section p-4 mb-4 shadow-sm rounded">
                    <h2 className="text-primary mb-3">Change Username</h2>
                    <form onSubmit={handleUsernameSubmit} className="username-form">
                        <div className="input-wrapper">
                            <label htmlFor="newUsername">New Username:</label>
                            <input
                                type="text"
                                id="newUsername"
                                className="form-control"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                minLength="3"
                            />
                        </div>
                        <div className="input-wrapper">
                            <label htmlFor="usernameCurrentPassword">Current Password:</label>
                            <input
                                type="password"
                                id="usernameCurrentPassword"
                                className="form-control"
                                value={usernameCurrentPassword}
                                onChange={(e) => setUsernameCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Update Username</button>
                    </form>
                </div>

                {/* Password Change Section */}
                <div className="settings-section password-section p-4 mb-4 shadow-sm rounded">
                    <h2 className="text-danger mb-3">Change Password</h2>
                    <form onSubmit={handlePasswordSubmit} className="password-form">
                        <div className="input-wrapper">
                            <label htmlFor="passwordCurrentPassword">Current Password:</label>
                            <input
                                type="password"
                                id="passwordCurrentPassword"
                                className="form-control"
                                value={passwordCurrentPassword}
                                onChange={(e) => setPasswordCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-wrapper">
                            <label htmlFor="newPassword">New Password:</label>
                            <input
                                type="password"
                                id="newPassword"
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength="6"
                            />
                        </div>
                        <div className="input-wrapper">
                            <label htmlFor="confirmPassword">Confirm New Password:</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength="6"
                            />
                        </div>
                        <button type="submit" className="btn btn-danger w-100">Update Password</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserSettings;