import React, { useState } from "react";
import axios from "axios";

function Addexam() {
  const [examName, setExamName] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/addexam", {
        examName,
        academicYear,
      });
      console.log("Exam Added Successfully:", response.data);
      setSuccessMessage("Exam Added Successfully!");
      setErrorMessage(""); // Clear any previous error message
    } catch (error) {
      console.error("Error sending data:", error);
      setErrorMessage("An error occurred. Please try again.");
      setSuccessMessage(""); // Clear any previous success message
    }
  };

  return (
    <>
      <div className="row">
        <div
          className="Section"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div className="col-xl-6 col-lg-6 col-12 mt-2 form-group">
            <label> Exam Name </label>
            <input
              type="text"
              placeholder="Enter the exam name"
              className="form-control"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
            />
          </div>
          <div className="col-xl-6 col-lg-6 col-12 mt-2 form-group">
            <label> Academic Year </label>
            <input
              type="text"
              className="form-control"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary submit "
            style={{
              width: "100%",
              maxWidth: "100px",
            }}
            onClick={handleSubmit}
          >
            Submit
          </button>

          {successMessage && (
            <p className="text-success mt-2">{successMessage}</p>
          )}
          {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
        </div>
      </div>
    </>
  );
}

export default Addexam;
