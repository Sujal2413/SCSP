import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Schemes.css";
import {
  SCHEMES,
  DEPARTMENTS,
  SCHEME_TYPES,
  deptName,
  deptTint,
} from "../data/schemes";

/* download a plain-text benefits sheet for a scheme */
function downloadBenefits(scheme) {
  const lines = [
    "SCSP — SCHOLARSHIP SCHEME BENEFITS",
    "==================================",
    "",
    `Scheme: ${scheme.name}`,
    `Department: ${deptName(scheme.dept)}`,
    `Type: ${scheme.type}`,
    `Category: ${scheme.category}`,
    `Level: ${scheme.level}`,
    `Benefit amount: ${scheme.amount}`,
    `Last date to apply: ${scheme.deadline}`,
    "",
    "BENEFITS",
    "--------",
    ...scheme.benefits.map((b) => `• ${b}`),
    "",
    "ELIGIBILITY",
    "-----------",
    ...scheme.eligibility.map((b) => `• ${b}`),
    "",
    "REQUIRED DOCUMENTS",
    "------------------",
    ...scheme.documents.map((b) => `• ${b}`),
    "",
    "Generated from the SCSP scholarship portal.",
  ].join("\n");

  const blob = new Blob([lines], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${scheme.id}-benefits.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const Schemes = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialDept = DEPARTMENTS.some((d) => d.code === searchParams.get("dept"))
    ? searchParams.get("dept")
    : "ALL";
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState(initialDept);
  const [type, setType] = useState("ALL");
  const [active, setActive] = useState(null); // scheme open in modal

  const counts = useMemo(() => {
    const m = {};
    SCHEMES.forEach((s) => (m[s.dept] = (m[s.dept] || 0) + 1));
    return m;
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SCHEMES.filter((s) => {
      const matchesQ =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        deptName(s.dept).toLowerCase().includes(q) ||
        s.type.toLowerCase().includes(q);
      const matchesDept = dept === "ALL" || s.dept === dept;
      const matchesType = type === "ALL" || s.type === type;
      return matchesQ && matchesDept && matchesType;
    });
  }, [query, dept, type]);

  return (
    <div className="schemes">
      {/* ===== header ===== */}
      <header className="sc-head">
        <h1>All Scholarship Schemes</h1>
        <p>
          Browse every post-matric scholarship, freeship and maintenance
          allowance across {DEPARTMENTS.length} government departments. Search,
          view detailed benefits, download a benefits sheet, and apply — all in
          one place.
        </p>

        {/* search */}
        <div className="sc-search">
          <span className="sc-search-ic">🔍</span>
          <input
            type="text"
            placeholder="Search for a scheme, department or category…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="sc-clear" onClick={() => setQuery("")}>
              ✕
            </button>
          )}
        </div>
      </header>

      {/* ===== all departments ===== */}
      <section className="sc-section" id="departments">
        <div className="sc-section-head">
          <h2>All Departments</h2>
          <span className="muted">{DEPARTMENTS.length} departments</span>
        </div>
        <div className="dept-grid">
          <button
            className={`dept-card ${dept === "ALL" ? "is-active" : ""}`}
            style={{ background: "var(--mist)" }}
            onClick={() => setDept("ALL")}
          >
            <strong>{SCHEMES.length}</strong>
            <span>All Departments</span>
          </button>
          {DEPARTMENTS.map((d) => (
            <button
              key={d.code}
              className={`dept-card ${dept === d.code ? "is-active" : ""}`}
              style={{ background: d.tint }}
              onClick={() => {
                setDept(d.code);
                document
                  .querySelector(".sc-results")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <strong>{counts[d.code] || 0}</strong>
              <span>{d.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ===== filters + results ===== */}
      <section className="sc-section sc-results">
        <div className="sc-toolbar">
          <div className="sc-filter">
            <label>Department</label>
            <select value={dept} onChange={(e) => setDept(e.target.value)}>
              <option value="ALL">All Departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div className="sc-filter">
            <label>Scheme type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="ALL">All Types</option>
              {SCHEME_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="sc-count">
            <strong>{results.length}</strong> scheme
            {results.length === 1 ? "" : "s"} found
          </div>
        </div>

        {results.length === 0 ? (
          <div className="sc-empty">
            <p>No schemes match your search.</p>
            <button
              className="btn btn-ghost"
              onClick={() => {
                setQuery("");
                setDept("ALL");
                setType("ALL");
              }}
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="scheme-grid">
            {results.map((s) => (
              <article className="scheme-card" key={s.id}>
                <div className="scheme-top">
                  <span
                    className="scheme-dept"
                    style={{ background: deptTint(s.dept) }}
                  >
                    {s.dept}
                  </span>
                  <span className="scheme-type">{s.type}</span>
                </div>
                <h3>{s.name}</h3>
                <p className="scheme-dept-name">{deptName(s.dept)}</p>
                <div className="scheme-meta">
                  <span className="chip">{s.category}</span>
                  <span className="chip ghost">{s.level}</span>
                </div>
                <div className="scheme-amount">
                  <span>Benefit</span>
                  <strong>{s.amount}</strong>
                </div>
                <div className="scheme-actions">
                  <button className="btn-sm primary" onClick={() => setActive(s)}>
                    View Benefits
                  </button>
                  <button
                    className="btn-sm ghost"
                    onClick={() => downloadBenefits(s)}
                  >
                    ⭳ Download
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ===== detail modal ===== */}
      {active && (
        <div className="sc-modal" onClick={() => setActive(null)}>
          <div className="sc-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="sc-modal-close" onClick={() => setActive(null)}>
              ✕
            </button>
            <span
              className="scheme-dept"
              style={{ background: deptTint(active.dept) }}
            >
              {deptName(active.dept)}
            </span>
            <h2>{active.name}</h2>
            <div className="sc-modal-meta">
              <span className="chip">{active.type}</span>
              <span className="chip">{active.category}</span>
              <span className="chip ghost">{active.level}</span>
            </div>

            <div className="sc-modal-amount">
              <div>
                <span>Benefit amount</span>
                <strong>{active.amount}</strong>
              </div>
              <div>
                <span>Last date to apply</span>
                <strong>{active.deadline}</strong>
              </div>
            </div>

            <h4>Benefits</h4>
            <ul className="ticks">
              {active.benefits.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>

            <h4>Eligibility</h4>
            <ul className="ticks">
              {active.eligibility.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>

            <h4>Required documents</h4>
            <div className="doc-chips">
              {active.documents.map((d) => (
                <span className="chip ghost" key={d}>
                  {d}
                </span>
              ))}
            </div>

            <div className="sc-modal-actions">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/apply")}
              >
                Apply Now
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => downloadBenefits(active)}
              >
                ⭳ Download benefits
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schemes;
