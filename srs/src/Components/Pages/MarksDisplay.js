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

          // Initialize obtainedMarks with an array of empty strings for each student and each subject
          const initialMarks = response.data.map(() =>
            subjectNames.map(() => "")
          );
          setObtainedMarks(initialMarks);
        } catch (error) {
          console.error("Error during fetching students", error);
        }
      }
      fetchStudents();
    }
  }, [selectedClass, subjectNames]);

  const handleSubmit = () => {
    const ObtainedMarksDetails = students.map((student, studentIndex) => ({
      studentName: {
        name: student.fname,
        rollNumber: student.roll,
        subjects: subjectNames.map((subject, subjectIndex) => ({
          subject: subject,
          // fullMarks: fullMarks[subjectIndex],
          obtainedMarks: obtainedMarks[studentIndex][subjectIndex],
        })),
      },
    }));

    const data = { examType: examName, class: selectedClass };

    // Convert ObtainedMarksDetails to a JSON string
    // const ObtainedMarksDetailsString = ObtainedMarksDetails;

    console.log("SEND DATA  ", ObtainedMarksDetails);

    // Now, you can use ObtainedMarksDetailsString for submission
    axios
      .post("/obtainedmarks", ObtainedMarksDetails)
      .then((response) => {
        console.log("Data submission success", response.data);
      })
      .catch((error) => {
        console.error("Error During submission", error);
      });
  };

  const handleObtainedMarksChange = (studentIndex, subjectIndex, value) => {
    const updatedObtainedMarks = [...obtainedMarks];
    if (!updatedObtainedMarks[studentIndex]) {
      updatedObtainedMarks[studentIndex] = [];
    }
    // Update the obtainedMarks for the specific subject and student
    updatedObtainedMarks[studentIndex][subjectIndex] = value;

    // Set the updated obtainedMarks
    setObtainedMarks(updatedObtainedMarks);

    // Log the current state of obtainedMarks with subject names
    const logObject = subjectNames.reduce((acc, subjectName, index) => {
      acc[subjectName] = updatedObtainedMarks[studentIndex][index];
      return acc;
    }, {});

    console.log(logObject);
  };

  console.log(JSON.stringify(obtainedMarks));
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
          {students.map((student, studentIndex) => (
            <tr key={student._id}>
              <td>{student.fname}</td>
              <td>{student.roll}</td>
              {subjectNames.map((subject, subjectIndex) => (
                <td key={subject._id}>
                  <input
                    type="number"
                    placeholder={`Obtained marks for ${subject}`}
                    value={obtainedMarks[studentIndex][subjectIndex]}
                    onChange={(e) =>
                      handleObtainedMarksChange(
                        studentIndex,
                        subjectIndex,
                        e.target.value
                      )
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
