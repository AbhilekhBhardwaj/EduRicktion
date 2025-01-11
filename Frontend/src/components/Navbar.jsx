// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <h1 className="navbar-logo">My App</h1>
            </div>
            <div className="navbar-right">
                <Link to="/login" className="navbar-link">Login</Link>
                <Link to="/signup" className="navbar-link">Sign Up</Link>
            </div>
        </nav>
    );
};

export default Navbar;
