import React, { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

export default function Dashboard() {
  const { me } = useContext(AuthContext);

  return (
    <div style={{ padding: 18, maxWidth: 980, margin: "0 auto" }}>
      <h2>Dashboard</h2>
      <p style={{ opacity: 0.85 }}>
        Logged in as <b>{me?.username}</b> ({me?.email || "no email"})
      </p>

      <div style={card}>
        <h3 style={{ marginTop: 0 }}>Next: SCSP Core Modules</h3>
        <ul style={{ opacity: 0.85, lineHeight: 1.7 }}>
          <li>Scholarship Listing + Filters</li>
          <li>Apply Flow + Document Upload</li>
          <li>Status Tracking + Notifications</li>
        </ul>
      </div>
    </div>
  );
}

const card = {
  marginTop: 14,
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 18,
  padding: 16,
};
