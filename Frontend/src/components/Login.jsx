import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/api/v1/user/signin", formData);

            // Save the token in localStorage
            const token = response.data.token;
            localStorage.setItem("authToken", token);

            // Navigate to Home2 page
            navigate("/home2");
        } catch (error) {
            setError(error.response?.data?.message || "Error logging in");
            console.error(error);
        }
    };

    return (
        <div className="login-container">
            <div className="form-container">
                <h2>Login</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <button type="submit">Login</button>
                </form>
                <Link to="/" className="back-button">Back to Home</Link>
            </div>
        </div>
    );
};

export default Login;
