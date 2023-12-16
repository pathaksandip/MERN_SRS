import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Student() {
  const [examNames, setExamNames] = useState([]);
  const [classNames, setClassNames] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [admissionID, setAdmissionID] = useState("");
  const [totalGradePoints, setTotalGradePoints] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState(null);
  const checkResult = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/result/obtained", {
        admissionID,
        selectedExam,
        selectedClass,
      });
      console.log("Server Response:", response.data);

      if (response.data && response.data.student) {
        // Log total GPA for the student
        const student = response.data.student;

        // Update state with total grade points and remarks
        setTotalGradePoints(student.totalGradePoints);
        setRemarks(student.remarks);
        setError(null);
      } else {
        console.log("Result Not found");

        // Optionally, reset state if needed
        setTotalGradePoints(null);
        setRemarks(null);
        if (response.status === 404) {
          setError("Result Not found");
        } else {
          setError("Internal Server Error");
        }
      }
    } catch (error) {
      console.log("ERROR", error);
      setTotalGradePoints(null);
      setRemarks(null);

      if (error.response && error.response.status === 400) {
        setError("Result Not found");
      } else {
        setError(error.message || "Internal Server Error");
      }

      // Clear error after 5 seconds (adjust as needed)
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  useEffect(() => {
    const fetchExamNames = async () => {
      try {
        const response = await axios.get("/api/exams");
        setExamNames(response.data || []);
        const classResponse = await axios.get("/classdetail");
        setClassNames(classResponse.data || []);
      } catch (error) {
        console.error("Error fetching exam names", error);
      }
    };

    // Fetch exam names and class details when the component mounts
    fetchExamNames();
  }, []);

  return (
    <div>
      <div className="container mt-2">
        <div className="row">
          <div className="col-md-6 leftside">
            <p id="tname">MBSS</p>
            <Link to={"/"}>
              <img src={"/images/logo.png"} className="logo" alt="logo" />
            </Link>
            <h2 className="quote">
              Transforming Education: Effortlessly Accurate Online School
              Results!
            </h2>
          </div>
          <div className="col-md-6 rightside">
            <form action="/loginadmin" method="post" className="login">
              <h1 className="row justify-content-center">
                School Result System
              </h1>
              <h5 className="row justify-content-center"> Student Panel</h5>
              <div className="mb-3">
                <label htmlFor="SelectExam" className="form-label">
                  Select Exam
                </label>
                <select
                  className="form-control"
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                >
                  <option value="">Select an exam</option>
                  {examNames.map((examName) => (
                    <option key={examName._id} value={examName.examName}>
                      {examName.examName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="Class" className="form-label">
                  Class
                </label>
                <select
                  className="form-control"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="">Select a class</option>
                  {classNames.map((className) => (
                    <option key={className._id} value={className.classNameS}>
                      {className.classNameS}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="Student ID" className="form-label">
                  Student ID
                </label>
                <input
                  value={admissionID}
                  onChange={(e) => setAdmissionID(e.target.value)}
                  type="number"
                  className="form-control"
                  placeholder="Enter Your ID"
                />
              </div>
              <div className="text-center d-flex flex-column">
                <button
                  onClick={checkResult}
                  type="submit"
                  className="btn btn-primary"
                >
                  View Result
                </button>
                <p className="text-center text-danger">{error}</p>
              </div>
              {totalGradePoints !== null && remarks && (
                <div>
                  <p>
                    You have Obtained {totalGradePoints} GPA and You are{" "}
                    {remarks}
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Student;
