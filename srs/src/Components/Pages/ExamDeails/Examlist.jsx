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

  const deleteExam = async (id) => {
    try {
      const response = await axios.delete(`/api/exam/${id}`);
      if (response.status === 200) {
        // Remove the deleted exam from the local state
        setExams((prevExams) => prevExams.filter((exam) => exam._id !== id));
        console.log("Exam deleted successfully");
      } else {
        console.error("Failed to delete exam");
      }
    } catch (error) {
      console.error("Error deleting exam:", error);
    }
  };

  return (
    <div>
      <h2>Exam Details</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-striped mt-5">
          <thead>
            <tr>
              <th>Exam Name</th>
              <th>Academic Year</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam._id}>
                <td>{exam.examName}</td>
                <td>{exam.academicYear}</td>
                <td>
                  <button
                    onClick={() => deleteExam(exam._id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExamList;
