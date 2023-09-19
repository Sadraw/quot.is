import React from "react";
import "../styles/HeroSection.css";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div>
          <h1>Welcome to quot.is</h1>
          <p>Your Source for Inspiring Quotes and Captivating Facts</p>
          <Link
            to="/Random-Quote"
            className="cta-button"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
