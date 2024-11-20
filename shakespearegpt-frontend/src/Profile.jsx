import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Profile = ({ apiUrl }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${apiUrl}/profile`, {
                    method: 'GET',
                    credentials: 'include', // Ensure session cookies are sent
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch profile');
                }
                const data = await response.json();
                setProfile(data);
                console.log('Fetched profile:', data); // Debugging log
            } catch (err) {
                console.error('Error fetching profile:', err.message); // Debugging log
                setError('Failed to load profile. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [apiUrl]);

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>User Profile</h1>
            {profile ? (
                <div>
                    <p><strong>Username:</strong> {profile.username}</p>
                    <h2>Past Conversations</h2>
                    <ul>
                        {profile.conversations.map((conversation) => (
                            <li key={conversation.id}>
                                <strong>Character:</strong> {conversation.character} -
                                <strong>Messages:</strong> {conversation.messagesCount}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No profile data available.</p>
            )}
        </div>
    );
};

Profile.propTypes = {
    apiUrl: PropTypes.string.isRequired, // Ensure apiUrl is provided
};

export default Profile;
