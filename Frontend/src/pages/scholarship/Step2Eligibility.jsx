import { useState } from "react";
import "./Step2Eligibility.css";
import { validateFileSize } from "../../utils/fileValidator";

export default function Step2Eligibility({ next, prev, formData, setFormData }) {
  const [showCasteFields, setShowCasteFields] = useState(
    formData.caste && formData.caste !== "OPEN"
  );

  const [isDisabled, setIsDisabled] = useState(
    formData.disability === "Yes"
  );

  const [fileError, setFileError] = useState("");

  const handleCaste = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, caste: value });
    setShowCasteFields(value !== "OPEN");
  };

  const handleDisability = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, disability: value });
    setIsDisabled(value === "Yes");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const isValid = validateFileSize(file, setFileError);
    if (!isValid) {
      e.target.value = "";
      return;
    }
  };

  // Helper category groups
  const NEEDS_NON_CREAMY = ["OBC", "VJ-A", "NT-B", "NT-C", "NT-D", "SBC", "SEBC"];
  const NEEDS_CASTE_VALIDITY = ["SC", "ST"];

  return (
    <div className="form-box">
      <h2 className="form-title">Eligibility Verification</h2>

      {/* CASTE */}
      <label className="label">Select Caste</label>
      <select
        className="form-input"
        value={formData.caste}
        onChange={handleCaste}
      >
        <option value="">Select Caste</option>
        <option value="OPEN">OPEN</option>
        <option value="OBC">OBC</option>
        <option value="SC">SC</option>
        <option value="ST">ST</option>
        <option value="VJ-A">VJ-A</option>
        <option value="NT-B">NT-B</option>
        <option value="NT-C">NT-C</option>
        <option value="NT-D">NT-D</option>
        <option value="SBC">SBC</option>
        <option value="SEBC">SEBC</option>
        <option value="EWS">EWS</option>
        <option value="OTHER">OTHER</option>
      </select>

      {/* DISABILITY */}
      <label className="label">Disability</label>
      <select
        className="form-input"
        value={formData.disability}
        onChange={handleDisability}
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>

      {/* DISABILITY FILE */}
      {isDisabled && (
        <>
          <label className="label">Upload Disability Certificate</label>
          <input
            type="file"
            accept=".jpg,.jpeg,.pdf"
            className="form-input file-input"
            onChange={handleFileChange}
          />
          <p className="file-hint">
            (Only jpeg, jpg, pdf files allowed And File size between 100 KB To 200 KB)
          </p>
          {fileError && <p className="file-error">{fileError}</p>}
        </>
      )}

      {/* CASTE FIELDS WHEN NOT OPEN */}
      {showCasteFields && (
        <>
          <label className="label">Caste Certificate Number</label>
          <input
            className="form-input"
            placeholder="Enter Caste Certificate Number"
          />

          <label className="label">Caste Certificate Upload</label>
          <input
            type="file"
            accept=".jpg,.jpeg,.pdf"
            className="form-input file-input"
            onChange={handleFileChange}
          />
          <p className="file-hint">
            (Only jpeg, jpg, pdf files allowed And File size between 100 KB To 200 KB)
          </p>
          {fileError && <p className="file-error">{fileError}</p>}

          <label className="label">Issuing Authority</label>
          <input
            className="form-input"
            placeholder="Tehsildar / SDM / Collector"
          />

          {/* NON-CREAMY LAYER */}
          {NEEDS_NON_CREAMY.includes(formData.caste) && (
            <>
              <label className="label">Non-Creamy Layer Certificate</label>
              <input
                type="file"
                accept=".jpg,.jpeg,.pdf"
                className="form-input file-input"
                onChange={handleFileChange}
              />
              <p className="file-hint">
                (Only jpeg, jpg, pdf files allowed And File size between 100 KB To 200 KB)
              </p>
              {fileError && <p className="file-error">{fileError}</p>}

              <label className="label">NCL Validity (Year)</label>
              <input className="form-input" type="number" placeholder="YYYY" />
            </>
          )}

          {/* CASTE VALIDITY (SC/ST) */}
          {NEEDS_CASTE_VALIDITY.includes(formData.caste) && (
            <>
              <label className="label">Caste Validity Certificate</label>
              <input
                type="file"
                accept=".jpg,.jpeg,.pdf"
                className="form-input file-input"
                onChange={handleFileChange}
              />
              <p className="file-hint">
                (Only jpeg, jpg, pdf files allowed And File size between 100 KB To 200 KB)
              </p>
              {fileError && <p className="file-error">{fileError}</p>}
            </>
          )}

          {/* EWS CERTIFICATE */}
          {formData.caste === "EWS" && (
            <>
              <label className="label">Upload EWS Certificate</label>
              <input
                type="file"
                accept=".jpg,.jpeg,.pdf"
                className="form-input file-input"
                onChange={handleFileChange}
              />
              <p className="file-hint">
                (Only jpeg, jpg, pdf files allowed And File size between 100 KB To 200 KB)
              </p>
              {fileError && <p className="file-error">{fileError}</p>}

              <label className="label">Upload Income Certificate</label>
              <input
                type="file"
                accept=".jpg,.jpeg,.pdf"
                className="form-input file-input"
                onChange={handleFileChange}
              />
              <p className="file-hint">
                (Only jpeg, jpg, pdf files allowed And File size between 100 KB To 200 KB)
              </p>
              {fileError && <p className="file-error">{fileError}</p>}
            </>
          )}
        </>
      )}

      {/* BUTTONS */}
      <div className="btn-row">
        <button className="prev-btn" onClick={prev}>Back</button>
        <button className="next-btn" onClick={next}>Next</button>
      </div>
    </div>
  );
}
