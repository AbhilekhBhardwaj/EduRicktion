// src/pages/Home.js
import React from "react";
import Navbar from "../components/Navbar";
import "./Home.css";

const Home = () => {
    return (
        <div className="home-container">
            <Navbar />
            <div className="home-content">
                <h2>Welcome to My App</h2>
                <p>Explore courses and more!</p>
            </div>
        </div>
    );
};

export default Home;
