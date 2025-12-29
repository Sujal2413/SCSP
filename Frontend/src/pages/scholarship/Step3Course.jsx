import React, { useState, useEffect } from "react";

import qualificationLevelsData from "../../utils/qualificationLevels";
import streamsData from "../../utils/streams";
import {
  states as statesData,
  districts as districtsData,
  talukas as talukasData
} from "../../utils/stateDistrictTaluka";

import institutes from "../../institute";
import "./Step3Course.css";

const Step3Course = ({ formData, setFormData, nextStep, prevStep }) => {
  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [filteredInstitutes, setFilteredInstitutes] = useState([]);
  const [fileError, setFileError] = useState("");

  const {
    admissionYear,
    instituteState = "Maharashtra",
    instituteDistrict,
    instituteTaluka,
    qualificationLevel,
    stream,
    instituteName,
    meritPercentage,
    meritDocument
  } = formData;

  /* Admission years */
  const admissionYears = [];
  for (let y = 1950; y <= 2026; y++) admissionYears.push(y);

  /* State → District */
  useEffect(() => {
    if (instituteState) {
      setDistricts(districtsData[instituteState] || []);
      setFormData(prev => ({
        ...prev,
        instituteDistrict: "",
        instituteTaluka: "",
        instituteName: ""
      }));
    }
  }, [instituteState]);

  /* District → Taluka */
  useEffect(() => {
    if (instituteDistrict) {
      setTalukas(talukasData[instituteDistrict] || []);
      setFormData(prev => ({
        ...prev,
        instituteTaluka: "",
        instituteName: ""
      }));
    }
  }, [instituteDistrict]);

  /* District → Colleges (MahaDBT logic) */
  useEffect(() => {
    if (instituteDistrict) {
      const filtered = institutes.filter(
        inst => inst.district === instituteDistrict
      );
      setFilteredInstitutes(filtered);
      setFormData(prev => ({ ...prev, instituteName: "" }));
    } else {
      setFilteredInstitutes([]);
    }
  }, [instituteDistrict]);

  /* File validation */
  const handleFileChange = file => {
    if (!file) return;

    const sizeInKB = file.size / 1024;

    if (sizeInKB < 100 || sizeInKB > 200) {
      setFileError("File size exceeded");
      setFormData(prev => ({ ...prev, meritDocument: null }));
      return;
    }

    setFileError("");
    setFormData(prev => ({ ...prev, meritDocument: file }));
  };

  return (
    <div className="form-box">
      <h2 className="form-title">Current Course Details</h2>

      {/* ROW 1 */}
      <div className="form-row">
        <div className="form-field">
          <label>Admission Year *</label>
          <select
            className="form-input"
            value={admissionYear || ""}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                admissionYear: e.target.value
              }))
            }
          >
            <option value="">Select Admission Year</option>
            {admissionYears.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Institute State *</label>
          <select className="form-input" value={instituteState}>
            {statesData.map((s, i) => (
              <option key={i} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ROW 2 */}
      <div className="form-row">
        <div className="form-field">
          <label>Institute District *</label>
          <select
            className="form-input"
            value={instituteDistrict || ""}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                instituteDistrict: e.target.value
              }))
            }
          >
            <option value="">Select District</option>
            {districts.map((d, i) => (
              <option key={i} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Institute Taluka *</label>
          <select
            className="form-input"
            value={instituteTaluka || ""}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                instituteTaluka: e.target.value
              }))
            }
          >
            <option value="">Select Taluka</option>
            {talukas.map((t, i) => (
              <option key={i} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ROW 3 */}
      <div className="form-row">
        <div className="form-field">
          <label>Qualification Level *</label>
          <select
            className="form-input"
            value={qualificationLevel || ""}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                qualificationLevel: e.target.value
              }))
            }
          >
            <option value="">Select Qualification</option>
            {qualificationLevelsData.map((q, i) => (
              <option key={i} value={q}>{q}</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Stream *</label>
          <select
            className="form-input"
            value={stream || ""}
            onChange={e =>
              setFormData(prev => ({ ...prev, stream: e.target.value }))
            }
          >
            <option value="">Select Stream</option>
            {streamsData.map((s, i) => (
              <option key={i} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ROW 4 */}
      <div className="form-row full">
        <div className="form-field">
          <label>College / School Name *</label>
          <select
            className="form-input"
            value={instituteName || ""}
            onChange={e =>
              setFormData(prev => ({ ...prev, instituteName: e.target.value }))
            }
          >
            <option value="">-- Select Institute --</option>
            {filteredInstitutes.map((inst, i) => (
              <option key={i} value={inst.instituteName}>
                {inst.instituteName} ({inst.instituteCode})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ROW 5 */}
      <div className="form-row">
        <div className="form-field">
          <label>Course Name *</label>
          <input className="form-input" placeholder="Enter course name" />
        </div>

        <div className="form-field">
          <label>CET / Merit Percentage *</label>
          <input
            className="form-input"
            placeholder="Enter score"
            value={meritPercentage || ""}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                meritPercentage: e.target.value
              }))
            }
          />
        </div>
      </div>

      {/* FILE UPLOAD */}
      <div className="form-row">
        <div className="form-field">
          <label>
            Upload CET / Merit Document <span className="required">*</span>
          </label>

          <div className="file-upload-wrapper">
            <input
              type="file"
              id="meritFile"
              className="file-input-hidden"
              accept=".pdf,.jpg,.jpeg"
              onChange={e => handleFileChange(e.target.files[0])}
            />

            <label htmlFor="meritFile" className="file-choose-btn">
              Choose file
            </label>

            <span className="file-name">
              {meritDocument ? meritDocument.name : "No file chosen"}
            </span>

            <button
              type="button"
              className="file-upload-btn"
              disabled={!meritDocument}
            >
              Upload
            </button>
          </div>

          <div className="file-hint">
            (Only jpeg, jpg, pdf files allowed And File size between 100 KB To 200 KB)
          </div>

          {fileError && <div className="error-text">{fileError}</div>}
        </div>
      </div>

      <div className="btn-row">
        <button className="back-btn" onClick={prevStep}>Back</button>
        <button className="next-btn" onClick={nextStep}>Next</button>
      </div>
    </div>
  );
};

export default Step3Course;
