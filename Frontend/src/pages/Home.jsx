import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* ============================= HERO ============================= */}
      <section
        className="hero"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}hero-scholarship.png)`,
        }}
      >
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="ht-line">Let’s unlock a</span>
            <span className="ht-pill">real opportunity</span>
            <span className="ht-line">for every student</span>
          </h1>

          <button className="hero-cta" onClick={() => navigate("/schemes")}>
            Explore Scholarships
          </button>

          <div className="hero-proof">
            <div className="proof-avatars">
              <span className="pa pa-1">A</span>
              <span className="pa pa-2">S</span>
              <span className="pa pa-3">R</span>
              <span className="pa pa-4">P</span>
            </div>
            <span className="proof-text">23 schemes listed</span>
          </div>
        </div>

      </section>

      {/* ============================= STAT BAND ============================= */}
      <section className="statband">
        <div className="hero-stats">
          <div className="stat">
            <strong>23</strong>
            <span>Scholarship schemes listed</span>
          </div>
          <div className="stat">
            <strong>11</strong>
            <span>Departments covered</span>
          </div>
          <div className="stat">
            <strong>154</strong>
            <span>Institutes in sample list</span>
          </div>
          <div className="stat">
            <strong>4</strong>
            <span>Scheme benefit types</span>
          </div>
        </div>
      </section>

      {/* ============================= TRUST BAR ============================= */}
      <section className="trustbar">
        <p>Trusted by students, colleges &amp; scholarship bodies across India</p>
        <div className="logos">
          <span>Govt. of Maharashtra</span>
          <span>AICTE</span>
          <span>UGC</span>
          <span>NSP</span>
          <span>Tribal Dev.</span>
          <span>EWS Cell</span>
        </div>
      </section>

      {/* ============================= MISSION ============================= */}
      <section className="band band-peach">
        <div className="band-inner split">
          <div className="split-copy">
            <h2>Access to education shouldn’t be a privilege.</h2>
            <p>
              Every year, thousands of eligible students miss scholarships simply
              because the information is scattered, outdated, or hard to understand.
              SCSP brings it all into one guided experience — matching your profile
              to the funding you actually qualify for.
            </p>
            <ul className="ticks">
              <li>Profile-based matching, not endless lists</li>
              <li>Verified government &amp; private sources</li>
              <li>Step-by-step eligibility checks</li>
            </ul>
          </div>
          <div className="split-art">
            <div className="art-card art-1">🎓<span>Merit + Means</span></div>
            <div className="art-card art-2">📑<span>Docs verified</span></div>
            <div className="art-card art-3">⚡<span>Fast apply</span></div>
          </div>
        </div>
      </section>

      {/* ============================= FEATURES ============================= */}
      <section className="band">
        <div className="band-inner">
          <div className="section-head">
            <h2>Built to fix the real problems</h2>
          </div>
          <div className="feature-grid">
            <article className="feature-card tint-sky">
              <div className="feature-ic">🎯</div>
              <h3>Accurate Matching</h3>
              <p>
                Scholarships tailored to your category, income, course and
                institute — not random listings you’ll never qualify for.
              </p>
            </article>
            <article className="feature-card tint-cream">
              <div className="feature-ic">🤖</div>
              <h3>AI Guidance</h3>
              <p>
                Step-by-step help through eligibility and required documents, so
                you never miss a criterion or a deadline.
              </p>
            </article>
            <article className="feature-card tint-lav">
              <div className="feature-ic">📚</div>
              <h3>Verified Data</h3>
              <p>
                Updated scholarship data sourced from trusted government and
                private portals — checked, not crowdsourced.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ============================= HOW IT WORKS ============================= */}
      <section className="band band-mist">
        <div className="band-inner">
          <div className="section-head">
            <h2>From profile to payout in four steps</h2>
          </div>
          <div className="steps">
            {[
              ["01", "Create your profile", "Tell us your category, income, course and institute once."],
              ["02", "Get matched", "We surface every scholarship you’re actually eligible for."],
              ["03", "Apply guided", "Fill the multi-step form with live eligibility checks."],
              ["04", "Track & receive", "Follow your application status right through to disbursal."],
            ].map(([n, t, d]) => (
              <div className="step" key={n}>
                <span className="step-n">{n}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================= ROADMAP ============================= */}
      <section className="band">
        <div className="band-inner split reverse">
          <div className="split-copy">
            <h2>What we are building next</h2>
            <p>
              The portal should earn trust through verified data, clear status
              tracking, and useful filters rather than unsupported impact claims.
            </p>
          </div>
          <div className="goals">
            {[
              ["Verify scheme deadlines against official portals", "In progress"],
              ["Add district, category, income, and course filters", "Ready for UI"],
              ["Connect saved applications to backend tracking", "Planned"],
            ].map(([label, status]) => (
              <div className="goal" key={label}>
                <div className="goal-top">
                  <span>{label}</span>
                  <strong>{status}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================= TESTIMONIALS ============================= */}
      <section className="band band-sky">
        <div className="band-inner">
          <div className="section-head">
            <h2>Changes we proudly made</h2>
          </div>
          <div className="quotes">
            {[
              ["“I didn’t know I qualified for three scholarships. SCSP found them in minutes.”", "Aditi R.", "B.Tech, 2nd year"],
              ["“The guided form meant I uploaded the right documents the first time.”", "Sahil M.", "Diploma, Final year"],
              ["“Finally a place that understands non-creamy layer and EWS rules clearly.”", "Pooja K.", "B.Sc Nursing"],
            ].map(([q, name, role]) => (
              <figure className="quote" key={name}>
                <blockquote>{q}</blockquote>
                <figcaption>
                  <span className="avatar">{name.charAt(0)}</span>
                  <span>
                    <strong>{name}</strong>
                    <small>{role}</small>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============================= FAQ ============================= */}
      <section className="band">
        <div className="band-inner narrow">
          <div className="section-head">
            <h2>Frequently asked questions</h2>
          </div>
          <div className="faq">
            {[
              ["Is SCSP free for students?", "Yes. Discovering and applying for scholarships through SCSP is completely free for students."],
              ["Where does the scholarship data come from?", "From verified government portals (NSP, state schemes) and trusted private foundations. We update listings regularly."],
              ["Do I need documents ready to start?", "No. You can build your profile first; the guided form tells you exactly which documents you’ll need at each step."],
              ["Which scholarships can I apply to?", "Matches are based on your category, family income, qualification level, stream and institute — so you only see what you’re eligible for."],
            ].map(([q, a]) => (
              <details className="faq-item" key={q}>
                <summary>{q}<span className="chev">+</span></summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============================= CTA ============================= */}
      <section className="cta">
        <div className="cta-inner">
          <h2>Your scholarship is closer than you think.</h2>
          <p>Build your profile once and let SCSP do the matching.</p>
          <div className="hero-actions center">
            <button className="btn btn-light" onClick={() => navigate("/apply")}>
              Apply Now
            </button>
            <button className="btn btn-ghost-light" onClick={() => navigate("/register")}>
              Create account
            </button>
          </div>
        </div>
      </section>

      {/* ============================= FOOTER ============================= */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-logo">● SCSP</span>
            <p>A smarter scholarship platform that solves real problems.</p>
            <a className="footer-email" href="mailto:sujalpatil0504@gmail.com">
              sujalpatil0504@gmail.com
            </a>
          </div>
          <div className="footer-cols">
            <div>
              <h4>Platform</h4>
              <a href="/apply">Apply</a>
              <a href="/schemes">Scholarships</a>
              <a href="/register">Register</a>
            </div>
            <div>
              <h4>Resources</h4>
              <a href="/schemes">All schemes</a>
              <a href="/study-abroad">Study abroad</a>
              <a href="/apply">Eligibility</a>
            </div>
            <div>
              <h4>Contact</h4>
              <a href="mailto:sujalpatil0504@gmail.com">Email us</a>
              <a href="/login">Login</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 SCSP. Education access for all.</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
