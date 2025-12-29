import React from "react";

export default function FileUpload({
  id,
  file,
  onFileChange,
  error,
  label = "Choose file",
}) {
  return (
    <>
      <div className="file-upload-wrapper">
        <input
          type="file"
          id={id}
          className="file-input-hidden"
          accept=".jpg,.jpeg,.pdf"
          onChange={(e) => onFileChange(e.target.files[0])}
        />

        <label htmlFor={id} className="file-choose-btn">
          {label}
        </label>

        <span className="file-name">
          {file ? file.name : "No file chosen"}
        </span>

        <button
          type="button"
          className="file-upload-btn"
          disabled={!file}
        >
          Upload
        </button>
      </div>

      <div className="file-hint">
        (Only jpeg, jpg, pdf files allowed And File size between 100 KB To 200 KB)
      </div>

      {error && <div className="error-text">{error}</div>}
    </>
  );
}
