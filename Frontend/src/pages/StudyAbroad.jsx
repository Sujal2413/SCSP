import React from "react";
import "./StudyAbroad.css";

const DESTINATIONS = [
  ["United States", "🇺🇸", "MS, MBA, research — STEM OPT work options"],
  ["United Kingdom", "🇬🇧", "1-year master's, Graduate Route visa"],
  ["Canada", "🇨🇦", "Affordable, PR pathway, GIC route"],
  ["Australia", "🇦🇺", "Strong post-study work rights"],
  ["Germany", "🇩🇪", "Low/no tuition, blocked-account route"],
  ["Ireland", "🇮🇪", "Tech hub, 2-year stay-back"],
];

const EXAMS = [
  ["IELTS / TOEFL / PTE", "English proficiency — required almost everywhere. Aim 6.5–7.5 bands."],
  ["GRE", "MS & technical master's. Many programs now optional — check each university."],
  ["GMAT", "MBA & management programs."],
  ["SAT", "Undergraduate admissions abroad."],
];

const ROADMAP = [
  [
    "18–24 months before",
    "Decide goal & destination",
    "Fix your course, country and budget. Compare tuition, living cost, visa rules, job market and PR pathways. Don't pick a course because it's trending — align it with long-term employability.",
  ],
  [
    "12–15 months before",
    "Take the entrance exams",
    "Prepare and sit IELTS/TOEFL/PTE, and GRE/GMAT/SAT if required. Book early so you have room for a retake if your score falls short.",
  ],
  [
    "10–12 months before",
    "Shortlist universities",
    "Pick 6–8 universities across ambitious, moderate and safe categories. Match entry requirements, intakes and scholarship deadlines.",
  ],
  [
    "8–10 months before",
    "Build your application",
    "Write a tailored SOP (800–1,000 words) for each university, collect 2–3 LORs, transcripts, CV and your score cards.",
  ],
  [
    "6–9 months before",
    "Apply & plan finances",
    "Submit applications (many run rolling admissions — apply early). Arrange proof of funds, education loan and scholarships. Canada needs a GIC; Germany a blocked account.",
  ],
  [
    "3–5 months before",
    "Accept offer & apply for visa",
    "Confirm your admission, pay the deposit, then file your student visa with proof of funds, SOP, medicals and police clearance. UK ~3 weeks, Australia 4–8, Canada 8–12 weeks.",
  ],
  [
    "0–2 months before",
    "Pre-departure",
    "Book accommodation, arrange forex/travel card, flights and insurance. Attend pre-departure briefings and pack your documents.",
  ],
];

const AGENCIES = [
  [
    "Jamboree Education",
    "Since 1993",
    "India's leading test-prep and admissions consultancy — GRE, GMAT, SAT, IELTS, TOEFL coaching plus university application support.",
    "https://www.jamboreeindia.com/",
  ],
  [
    "IDP Education",
    "50+ years",
    "End-to-end overseas education counselling and an official IELTS test partner, with strong university ties in Australia and the UK.",
    "https://www.idp.com/india/",
  ],
  [
    "Career Launcher",
    "Test prep & admits",
    "Coaching and study-abroad counselling for GRE, GMAT, SAT and IELTS, with profile-building and application guidance.",
    "https://www.careerlauncher.com/",
  ],
  [
    "Edwise International",
    "Since 1991",
    "One of India's oldest consultancies — 40+ branches and partnerships with 745+ universities worldwide.",
    "https://www.edwiseinternational.com/",
  ],
  [
    "Leverage Edu",
    "AI-led guidance",
    "Mentor-driven platform for university selection, applications, loans and scholarships.",
    "https://leverageedu.com/",
  ],
  [
    "Yocket",
    "Community + tools",
    "Student community, university comparison, admit predictor, loans and counselling.",
    "https://yocket.com/",
  ],
];

const StudyAbroad = () => {
  return (
    <div className="sa">
      <header className="sa-head">
        <span className="sa-kicker">Study Abroad</span>
        <h1>Your roadmap to studying abroad</h1>
        <p>
          A clear, month-by-month plan to take you from "I want to study abroad"
          to landing on campus — plus the exams, top destinations and trusted
          consultants who can guide you along the way.
        </p>
      </header>

      {/* destinations */}
      <section className="sa-section">
        <h2>Popular destinations</h2>
        <div className="sa-dest-grid">
          {DESTINATIONS.map(([name, flag, note]) => (
            <div className="sa-dest" key={name}>
              <span className="sa-flag">{flag}</span>
              <strong>{name}</strong>
              <span className="sa-note">{note}</span>
            </div>
          ))}
        </div>
      </section>

      {/* exams */}
      <section className="sa-section sa-band">
        <h2>Exams you may need</h2>
        <div className="sa-exam-grid">
          {EXAMS.map(([name, desc]) => (
            <div className="sa-exam" key={name}>
              <h3>{name}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* roadmap timeline */}
      <section className="sa-section">
        <div className="sa-section-head">
          <h2>The step-by-step roadmap</h2>
          <p>
            Ideally begin 18–24 months before your intake. Each step builds on
            the last — start early so no stage is rushed.
          </p>
        </div>
        <ol className="sa-timeline">
          {ROADMAP.map(([when, title, desc], i) => (
            <li className="sa-step" key={title}>
              <span className="sa-step-n">{String(i + 1).padStart(2, "0")}</span>
              <div className="sa-step-body">
                <span className="sa-when">{when}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* agencies */}
      <section className="sa-section sa-band">
        <div className="sa-section-head">
          <h2>Agencies that can guide you</h2>
          <p>
            Established consultants offering counselling, test prep, applications,
            scholarships and visa support. Compare a few before you commit.
          </p>
        </div>
        <div className="sa-agency-grid">
          {AGENCIES.map(([name, tag, desc, url]) => (
            <a
              className="sa-agency"
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="sa-agency-top">
                <strong>{name}</strong>
                <span className="sa-tag">{tag}</span>
              </div>
              <p>{desc}</p>
              <span className="sa-visit">Visit website →</span>
            </a>
          ))}
        </div>
        <p className="sa-disclaimer">
          Listed for guidance only — SCSP is not affiliated with these agencies.
          Always verify current fees, services and reviews yourself.
        </p>
      </section>
    </div>
  );
};

export default StudyAbroad;
