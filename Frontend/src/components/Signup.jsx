import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
                email,
                password,
                firstName,
                lastName,
            });

            setMessage("User created successfully!");
            console.log("User ID:", response.data.userId);

            // Navigate to Home2 page
            navigate("/home2");
        } catch (err) {
            setMessage(err.response ? err.response.data.message : "Server error");
        }
    };

    return (
        <div className="signup-container">
            <h2>Create an Account</h2>
            <form onSubmit={handleSubmit} className="signup-form">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
                <button type="submit">Sign Up</button>
            </form>
            {message && <p>{message}</p>}
            <Link to="/" className="back-button">Back to Home</Link>
        </div>
    );
};

export default Signup;
