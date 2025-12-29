import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";


const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="home-wrapper">

      {/* HERO SECTION */}
      <section className="hero-section">
        <h1 className="hero-title">
          A Smarter Scholarship Platform <br />
          That Solves Real Problems
        </h1>

        <p className="hero-subtitle">
          SCSP removes confusion, outdated information, and irrelevant results.
          Discover scholarships the smart way with AI-powered guidance built for students.
        </p>

        {/* 🔘 BUTTON GROUP */}
        <div className="hero-btn-group">
          <button className="hero-cta primary">
            Explore Scholarships
          </button>

          <button className="btn-secondary" onClick={() => navigate("/apply")}>
            Apply Now
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <div className="feature-card">
          <h3>🎯 Accurate Matching</h3>
          <p>Scholarships tailored to your profile — not random listings.</p>
        </div>

        <div className="feature-card">
          <h3>🤖 AI Guidance</h3>
          <p>Step-by-step help so you never miss eligibility or deadlines.</p>
        </div>

        <div className="feature-card">
          <h3>📚 Verified Data</h3>
          <p>Updated scholarships sourced from trusted government & private portals.</p>
        </div>
      </section>

    </div>
  );
};

export default Home;
