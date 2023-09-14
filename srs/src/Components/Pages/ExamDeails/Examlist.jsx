import React, { useState, useEffect } from "react";
import axios from "axios";

function ExamList() {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    async function fetchExamDetails() {
      try {
        const response = await axios.get("/api/exams");
        if (!response.data) {
          throw new Error("No data returned");
        }
        setExams(response.data);
      } catch (error) {
        console.error("Error fetching exam details:", error);
      }
    }

    fetchExamDetails();
  }, []);

  return (
    <div>
      <h2>Exam Details</h2>
      <table>
        <thead>
          <tr>
            <th>Exam Name</th>
            <th>Academic Year</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam) => (
            <tr key={exam._id}>
              <td>{exam.examName}</td>
              <td>{exam.academicYear}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExamList;
