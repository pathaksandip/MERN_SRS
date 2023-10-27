import React, { useState, useEffect } from "react";
import axios from "axios";

function MarksDisplay() {
  const [subjectMarks, setSubjectMarks] = useState([]);

  useEffect(() => {
    // Fetch data for subject marks
    async function fetchSubjectMarks() {
      try {
        const response = await axios.get("/api/subject-marks"); // Replace with the correct API endpoint
        if (response.data) {
          setSubjectMarks(response.data);
        } else {
          throw new Error("No data found");
        }
      } catch (error) {
        console.error("Error during fetching subject marks", error);
      }
    }

    fetchSubjectMarks();
  }, []);

  return (
    <div>
      <h2>Subject Marks</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Student's Name</th>
            <th>SubjectName</th>
          </tr>
        </thead>
        <tbody>
          {subjectMarks.map((subject) => (
            <tr key={subject._id}>
              <td>{subject.subjectName}</td>
              <td>{subject.fullMarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MarksDisplay;
