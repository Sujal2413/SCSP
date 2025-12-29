import React from "react";
import "./hero.css";

const Hero = () => {
  return (
    <section className="hero-container">
      <div className="hero-content">
        <h1 className="hero-title">
          A Smarter Scholarship Platform That Solves Real Problems
        </h1>

        <p className="hero-subtitle">
          SCSP eliminates all the issues seen in current scholarship portals —
          confusion, outdated information, irrelevant results, and zero
          guidance. Discover scholarships the smart way with our AI-powered
          platform.
        </p>

        <button className="hero-btn">Explore Scholarships</button>
      </div>
    </section>
  );
};

export default Hero;
