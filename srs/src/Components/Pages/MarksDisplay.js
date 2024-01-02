import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router";

function MarksDisplay() {
  const [students, setStudents] = useState([]);
  const location = useLocation();
  const selectedClass = location.state.selectedClass;
  const subjectNames = location.state.subjectNames || [];
  const examName = location.state.examName;
  const SubjectMarks = location.state.fullMarks || [];
  const [obtainedMarks, setObtainedMarks] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState(null);

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

  // const checkDetails = async () => {
  //   try {
  //     const response = await axios.get("/api/check-exam-exist", {
  //       params: {
  //         selectedClass,
  //         examName,
  //       },
  //     });
  //     console.log("API Check Response:", response.data);
  //     if (response.status === 200) {
  //       console.log(
  //         "The selected exam already exists for this class. Cannot submit."
  //       );
  //       setSubmissionStatus("error");
  //       return;
  //     }
  //   } catch (error) {
  //     // Handle the error if needed
  //     console.error("Error during API call", error);
  //   }
  // };

  const handleSubmit = async () => {
    const metadata = {
      Studentclass: selectedClass,
      examType: examName,
    };

    try {
      // Check if the exam exists for any student in the selected class
      const response = await axios.get("/api/check-exam-exist", {
        params: {
          Studentclass: selectedClass,
          examType: examName,
        },
      });

      if (response.data.examExists) {
        console.log(
          "The selected exam already exists for this class. Cannot submit."
        );
        setSubmissionStatus("error");
        return;
      }

      const ObtainedMarksDetails = students.map((student, studentIndex) => ({
        studentName: {
          name: student.fname,
          rollNumber: student.roll,
          admissionID: student.admissionID,
          subjects: subjectNames.map((subject, subjectIndex) => ({
            subject: subject,
            obtainedMarks: obtainedMarks[studentIndex][subjectIndex],
            fullMarks: SubjectMarks[subjectIndex].fullMarks,
            passMarks: SubjectMarks[subjectIndex].passMarks,
          })),
        },
      }));

      const data = {
        metadata: metadata,
        ObtainedMarksDetails: ObtainedMarksDetails,
      };

      axios
        .post("/obtainedmarks", data)
        .then((response) => {
          console.log("Data submission success", response.data);
          setSubmissionStatus("success");

          // Clear the success message after 5 seconds
          setTimeout(() => {
            setSubmissionStatus(null);
          }, 5000);
        })
        .catch((error) => {
          console.error("Error During submission", error);
          setSubmissionStatus("error");
        });
    } catch (error) {
      console.error("Error during exam validation check", error);
      setSubmissionStatus("error");
    }
  };

  const handleObtainedMarksChange = (studentIndex, subjectIndex, value) => {
    const updatedObtainedMarks = [...obtainedMarks];
    if (!updatedObtainedMarks[studentIndex]) {
      updatedObtainedMarks[studentIndex] = [];
    }
    const fullMarks = SubjectMarks[subjectIndex].fullMarks;
    const validatedValue = Math.min(Number(value), fullMarks);

    // Update the obtainedMarks for the specific subject and student
    updatedObtainedMarks[studentIndex][subjectIndex] = validatedValue;

    // Set the updated obtainedMarks
    setObtainedMarks(updatedObtainedMarks);
    setSubmissionStatus(null); // Reset submission status on any input change
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
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Student's Name</th>
              <th>Roll No</th>
              <th>Student ID</th>

              {subjectNames.map((subjectName, index) => (
                <th key={index}>
                  {subjectName}
                  <br />({SubjectMarks[index].fullMarks})
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student, studentIndex) => (
              <tr key={student._id}>
                <td>{student.fname}</td>
                <td>{student.roll}</td>
                <td>{student.admissionID}</td>
                {subjectNames.map((subject, subjectIndex) => (
                  <td key={subject._id}>
                    <input
                      type="number"
                      value={obtainedMarks[studentIndex][subjectIndex]}
                      onChange={(e) =>
                        handleObtainedMarksChange(
                          studentIndex,
                          subjectIndex,
                          e.target.value
                        )
                      }
                      max={SubjectMarks[subjectIndex].fullMarks}
                      className="form-control form-control-sm border-dark"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {submissionStatus === "success" && (
        <div style={{ color: "green", fontSize: "16px", marginBottom: "10px" }}>
          Submission successful!
        </div>
      )}
      {submissionStatus === "error" && (
        <div style={{ color: "red", fontSize: "16px", marginBottom: "10px" }}>
          Submission failed. The selected exam already exists for this class.
        </div>
      )}
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
