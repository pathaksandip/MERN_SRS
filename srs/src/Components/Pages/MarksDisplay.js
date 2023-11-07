import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router";

function MarksDisplay() {
  const [students, setStudents] = useState([]);
  const location = useLocation();
  const selectedClass = location.state.selectedClass;
  const subjectNames = location.state.subjectNames || [];
  const examName = location.state.examName;
  const fullMarks = location.state.fullMarks || [];
  const [obtainedMarks, setObtainedMarks] = useState([]);

  useEffect(() => {
    if (selectedClass) {
      async function fetchStudents() {
        try {
          const response = await axios.get(
            `http://localhost:4000/sstudentsdetails?class=${selectedClass}`
          );
          setStudents(response.data);
        } catch (error) {
          console.error("Error during fetching students", error);
        }
      }
      fetchStudents();
    }
  }, [selectedClass]);

  const handleSubmit = () => {
    const ObtainedMarksDetails = students.map((student, index) => ({
      studentName: student.fname,
      rollNumber: student.roll,
      class: selectedClass,
      examType: examName,
      fullMarks: fullMarks[index].fullMarks,
      passMarks: fullMarks[index].passMarks,
      obtainedMarks: obtainedMarks[index],
    }));
    axios
      .post("/obtainedmarks", ObtainedMarksDetails)
      .then((response) => {
        console.log("Data submission success", response.data);
      })
      .catch((error) => {
        console.error("Error During submission", error);
      });
  };

  const handleObtainedMarksChange = (index, value) => {
    const updatedObtainedMarks = [...obtainedMarks];
    updatedObtainedMarks[index] = value;
    setObtainedMarks(updatedObtainedMarks);
  };

  return (
    <div>
      <h2>Obtained Marks</h2>
      <div className="row">
        <div className="col-7">
          <h5>Class: {selectedClass}</h5>
        </div>
        <div className="col-5">
          <h5>Exam: {examName}</h5>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Student's Name</th>
            <th>Roll No</th>
            {subjectNames.map((subjectName, index) => (
              <th key={index}>
                {subjectName}
                <br />({fullMarks[index].fullMarks})
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.fname}</td>
              <td>{student.roll}</td>
              {subjectNames.map((subject, index) => (
                <td key={subject._id}>
                  <input
                    type="number"
                    placeholder="Obtained marks"
                    value={obtainedMarks[index]}
                    onChange={(e) =>
                      handleObtainedMarksChange(index, e.target.value)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button
        style={{ display: "block", margin: "0 auto" }}
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
}

export default MarksDisplay;
