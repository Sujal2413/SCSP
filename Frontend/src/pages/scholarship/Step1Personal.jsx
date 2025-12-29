import React, { useState } from "react";
import "./Step1Personal.css";
import { validateFileSize } from "../../utils/fileValidator";

export default function Step1Personal({ onNext }) {
  const [casteCategory, setCasteCategory] = useState("");
  const [hasIncomeCert, setHasIncomeCert] = useState("");
  const [hasDomicileCert, setHasDomicileCert] = useState("");

  const [fileError, setFileError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    const isValid = validateFileSize(file, setFileError);
    if (!isValid) {
      e.target.value = "";
      return;
    }
  };

  return (
    <div className="form-box">
      <h2 className="form-title">Personal Details</h2>

      {/* ================= Applicant Details ================= */}
      <h3 className="section-title">Applicant Details</h3>
      <div className="grid-2">
        <div className="field">
          <label>Applicant Full Name *</label>
          <input placeholder="Enter full name" />
        </div>

        <div className="field">
          <label>Full Name (As per SSC / LC) *</label>
          <input placeholder="Enter name as per certificate" />
        </div>

        <div className="field">
          <label>Email *</label>
          <input placeholder="Enter email" />
        </div>

        <div className="field">
          <label>Mobile Number *</label>
          <input placeholder="Enter mobile number" />
        </div>

        <div className="field">
          <label>Parent / Guardian Mobile *</label>
          <input placeholder="Enter parent mobile" />
        </div>

        <div className="field">
          <label>Aadhaar Number *</label>
          <input placeholder="Enter Aadhaar number" />
        </div>

        <div className="field">
          <label>Upload Aadhaar Card *</label>
          <input
            type="file"
            accept=".jpg,.jpeg,.pdf"
            className="file-input"
            onChange={handleFileChange}
          />
          <p className="file-hint">
            (Only jpeg, jpg, pdf files allowed And File size between 100 KB To 200 KB)
          </p>
          {fileError && <p className="file-error">{fileError}</p>}
        </div>
      </div>

      {/* ================= Address Details ================= */}
      <h3 className="section-title">Address Details</h3>
      <div className="grid-1">
        <div className="field">
          <label>Address *</label>
          <input placeholder="Enter address" />
        </div>
      </div>

      <div className="grid-2">
        <div className="field">
          <label>City *</label>
          <input placeholder="Enter city" />
        </div>

        <div className="field">
          <label>State *</label>
          <select>
            <option value="">Select State</option>
          </select>
        </div>

        <div className="field">
          <label>District *</label>
          <select>
            <option value="">Select District</option>
          </select>
        </div>
      </div>

      {/* ================= Social & Income Details ================= */}
      <h3 className="section-title">Social & Income Details</h3>
      <div className="grid-2">
        <div className="field">
          <label>Marital Status *</label>
          <select>
            <option value="">Select</option>
            <option>Single</option>
            <option>Married</option>
          </select>
        </div>

        <div className="field">
          <label>Religion *</label>
          <select>
            <option value="">Select</option>
            <option>Hindu</option>
            <option>Muslim</option>
            <option>Christian</option>
            <option>Sikh</option>
            <option>Buddhist</option>
            <option>Jain</option>
            <option>Other</option>
          </select>
        </div>

        <div className="field">
          <label>Caste Category *</label>
          <select
            value={casteCategory}
            onChange={(e) => setCasteCategory(e.target.value)}
          >
            <option value="">Select</option>
            <option value="OPEN">OPEN</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="OBC">OBC</option>
            <option value="VJNT">VJNT</option>
            <option value="EWS">EWS</option>
          </select>
        </div>

        <div className="field">
          <label>Family Annual Income *</label>
          <input placeholder="Enter income" />
        </div>
      </div>

      {casteCategory && casteCategory !== "OPEN" && (
        <div className="grid-1">
          <div className="field">
            <label>Upload Caste Certificate *</label>
            <input
              type="file"
              accept=".jpg,.jpeg,.pdf"
              className="file-input"
              onChange={handleFileChange}
            />
            <p className="file-hint">
              (Only jpeg, jpg, pdf files allowed And File size between 100 KB To 200 KB)
            </p>
            {fileError && <p className="file-error">{fileError}</p>}
          </div>
        </div>
      )}

      {/* ================= Income Certificate ================= */}
      <h3 className="section-title">Income Certificate Details</h3>
      <div className="grid-2">
        <div className="field">
          <label>Do you have Income Certificate? *</label>
          <select
            value={hasIncomeCert}
            onChange={(e) => setHasIncomeCert(e.target.value)}
          >
            <option value="">Select</option>
            <option value="YES">Yes</option>
            <option value="NO">No</option>
          </select>
        </div>

        {hasIncomeCert === "YES" && (
          <div className="field">
            <label>Income Certificate Number *</label>
            <input placeholder="Enter certificate number" />
          </div>
        )}
      </div>

      {hasIncomeCert === "YES" && (
        <div className="grid-1">
          <div className="field">
            <label>Upload Income Certificate *</label>
            <input
              type="file"
              accept=".jpg,.jpeg,.pdf"
              className="file-input"
              onChange={handleFileChange}
            />
            <p className="file-hint">
              (Only jpeg, jpg, pdf files allowed And File size between 100 KB To 200 KB)
            </p>
            {fileError && <p className="file-error">{fileError}</p>}
          </div>
        </div>
      )}

      {/* ================= Domicile Certificate ================= */}
      <h3 className="section-title">Domicile Certificate Details</h3>
      <div className="grid-2">
        <div className="field">
          <label>Do you have Domicile Certificate? *</label>
          <select
            value={hasDomicileCert}
            onChange={(e) => setHasDomicileCert(e.target.value)}
          >
            <option value="">Select</option>
            <option value="YES">Yes</option>
            <option value="NO">No</option>
          </select>
        </div>

        {hasDomicileCert === "YES" && (
          <div className="field">
            <label>Domicile Certificate Number *</label>
            <input placeholder="Enter certificate number" />
          </div>
        )}
      </div>

      {hasDomicileCert === "YES" && (
        <div className="grid-1">
          <div className="field">
            <label>Upload Domicile Certificate *</label>
            <input
              type="file"
              accept=".jpg,.jpeg,.pdf"
              className="file-input"
              onChange={handleFileChange}
            />
            <p className="file-hint">
              (Only jpeg, jpg, pdf files allowed And File size between 100 KB To 200 KB)
            </p>
            {fileError && <p className="file-error">{fileError}</p>}
          </div>
        </div>
      )}

      {/* ================= Bank Details ================= */}
      <h3 className="section-title">Bank Details</h3>
      <div className="grid-2">
        <div className="field">
          <label>Bank Name *</label>
          <input />
        </div>

        <div className="field">
          <label>Account Number *</label>
          <input />
        </div>

        <div className="field">
          <label>IFSC Code *</label>
          <input />
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="form-actions">
        <button type="button" className="next-btn" onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
}
