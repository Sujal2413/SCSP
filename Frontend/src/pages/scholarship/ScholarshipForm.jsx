import { useState } from "react";
import Step1Personal from "./Step1Personal";
import Step2Eligibility from "./Step2Eligibility";
import Step3Course from "./Step3Course";

export default function ScholarshipForm() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    instituteState: "Maharashtra",
    instituteDistrict: "",
    instituteTaluka: "",
    qualificationLevel: "",
    stream: "",
  });

  return (
    <>
      {/* Step Indicator (KEEP AS IS) */}
      <div className="step-indicator">
        <div
          className={`step-circle ${step === 1 ? "step-active" : ""}`}
          onClick={() => setStep(1)}
        >
          1
        </div>

        <div
          className={`step-circle ${step === 2 ? "step-active" : ""}`}
          onClick={() => setStep(2)}
        >
          2
        </div>

        <div
          className={`step-circle ${step === 3 ? "step-active" : ""}`}
          onClick={() => setStep(3)}
        >
          3
        </div>
      </div>

      {/* ✅ PAGE LAYOUT WRAPPER (THIS WAS MISSING) */}
      <div className="page-container">
        <div className="scholarship-form-wrapper">
          {step === 1 && (
            <Step1Personal
              onNext={() => setStep(2)}
              formData={formData}
              setFormData={setFormData}
            />
          )}

          {step === 2 && (
            <Step2Eligibility
              next={() => setStep(3)}
              prev={() => setStep(1)}
              formData={formData}
              setFormData={setFormData}
            />
          )}

          {step === 3 && (
            <Step3Course
              prev={() => setStep(2)}
              nextStep={() => setStep(4)} // future step
              formData={formData}
              setFormData={setFormData}
            />
          )}
        </div>
      </div>
    </>
  );
}
