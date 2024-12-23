import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure this is imported for Bootstrap styling
import './Register.css'; // If you have any additional custom styles

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                alert('Registration successful!');
                navigate('/login');
            } else {
                alert('Registration failed!');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="auth-page d-flex justify-content-center align-items-center">
            <div className="register-container p-4 shadow-lg rounded">
                <h2 className="text-center mb-4">Register to CelebrAI</h2>
                <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
                    <div className="form-group w-100">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            className="form-control mb-3"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group w-100">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="form-control mb-3"
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="register-main-btn w-100">Register</button>
                </form>

                {/* Already registered? Login hyperlink */}
                <div className="login-link text-center mt-3">
                    <p>Already have an account? <Link to="/login">Login here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
