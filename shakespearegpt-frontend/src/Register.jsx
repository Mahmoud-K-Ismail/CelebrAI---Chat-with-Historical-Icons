// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './App.css'; // Importing the CSS file for styling
//
// const Register = () => {
//     const [formData, setFormData] = useState({ username: '', password: '' });
//     const navigate = useNavigate();
//
//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await fetch('/auth/register', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(formData),
//             });
//             if (response.ok) {
//                 alert('Registration successful!');
//                 navigate('/login');
//             } else {
//                 alert('Registration failed!');
//             }
//         } catch (err) {
//             console.error(err);
//         }
//     };
//
//     return (
//         <div className="auth-container">
//             <h2>Register to CelebrAI</h2>
//             <form onSubmit={handleSubmit}>
//                 <input type="text" name="username" placeholder="Username" onChange={handleChange} />
//                 <input type="password" name="password" placeholder="Password" onChange={handleChange} />
//                 <button type="submit">Register</button>
//             </form>
//         </div>
//     );
// };
//
// export default Register;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Importing the CSS file for styling

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
        <div className="auth-page">
            <div className="register-container">
                <h2>Register to CelebrAI</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="username" placeholder="Username" onChange={handleChange} />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
