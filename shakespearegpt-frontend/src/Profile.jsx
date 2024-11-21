import React, { useState, useEffect } from 'react';

const Profile = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('/profile');
                if (response.ok) {
                    const data = await response.json();
                    setFormData({ username: data.username });
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/profile/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                alert('Profile updated!');
            } else {
                alert('Update failed!');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="username" value={formData.username} onChange={handleChange} />
            <input type="password" name="password" placeholder="New Password" onChange={handleChange} />
            <button type="submit">Update Profile</button>
        </form>
    );
};

export default Profile;
