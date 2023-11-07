import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router";
function AddexamDetails() {
  const navigate = useNavigate();
  const [examOptions, setExamOptions] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [classNames, setClassNames] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [subjectMarks, setSubjectMarks] = useState([]);
  const [selectedClassName, setSelectedClassName] = useState("");
  const [examName, setExamName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchExamOptions() {
      try {
        const response = await axios.get("/api/exams");
        if (!response.data) {
          throw new Error("No data found");
        }
        setExamOptions(response.data);
      } catch (error) {
        console.error("Error during fetching exam options", error);
      }
    }

    async function fetchClassNames() {
      try {
        const response = await axios.get("http://localhost:4000/classdetail");
        if (!response.data) {
          throw new Error("No data found");
        }
        setClassNames(response.data);
      } catch (error) {
        console.error("Error during fetching class names", error);
      }
    }

    fetchExamOptions();
    fetchClassNames(); // Fetch class names when the component loads
  }, []);

  const handleExamChange = (e) => {
    const selectedExamId = e.target.value;
    setSelectedExam(selectedExamId);

    // Find the exam name corresponding to the selected exam
    const selectedExam = examOptions.find(
      (exam) => exam._id === selectedExamId
    );

    if (selectedExam) {
      setExamName(selectedExam.examName);
    } else {
      setExamName(""); // Clear the exam name if not found
    }
  };

  const handleclassnamechange = (e) => {
    const selectedClassId = e.target.value;
    setSelectedClass(selectedClassId);

    // Find the class name corresponding to the selected class
    const selectedClassName = classNames.find(
      (className) => className._id === selectedClassId
    );

    if (selectedClassName) {
      setSelectedClassName(selectedClassName.classNameS);
    } else {
      setSelectedClassName(""); // Clear the class name if not found
    }
  };

  const fetchAssignedSubjects = async (classId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/classdetail/${classId}/assignsubjects`
      );
      if (response.data) {
        setAssignedSubjects(response.data);
        // Initialize subjectMarks with empty marks for each subject
        setSubjectMarks(
          response.data.map(() => ({ fullMarks: "", passMarks: "" }))
        );
      } else {
        console.error("No data found");
      }
    } catch (error) {
      console.error("Error during fetching assigned subjects", error);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      fetchAssignedSubjects(selectedClass);
    }
  }, [selectedClass]);

  const handleFullMarksChange = (index, value) => {
    const updatedSubjectMarks = [...subjectMarks];
    updatedSubjectMarks[index].fullMarks = value;
    setSubjectMarks(updatedSubjectMarks);
  };

  const handlePassMarksChange = (index, value) => {
    const updatedSubjectMarks = [...subjectMarks];
    updatedSubjectMarks[index].passMarks = value;
    setSubjectMarks(updatedSubjectMarks);
  };
  //forclearing
  const clearSuccessMessage = () => {
    setSuccessMessage("");
  };

  const clearErrorMessage = () => {
    setErrorMessage("");
  };

  const handleSubmission = () => {
    // Declare an array to store subject names
    const subjectNames = assignedSubjects.map((subject) => subject.subjectName);

    // Create a data object that includes selectedExam, selectedClass, subjectMarks, and subjectNames
    const data = {
      selectedExam,
      selectedClass,
      subjectMarks: subjectMarks.map((subjectMark, index) => ({
        subjectName: subjectNames[index],
        fullMarks: subjectMark.fullMarks,
        passMarks: subjectMark.passMarks,
      })),
      selectedClassName,
      examName,
    };

    axios
      .get("/api/check-exam-exists", {
        params: { selectedExam, selectedClass },
      })
      .then((response) => {
        if (response.data.examExists) {
          console.log(
            "The selected exam already exists for this class. Cannot submit."
          );
          setErrorMessage(
            "The selected exam already exists for this class. Cannot submit."
          );
          setSuccessMessage("");
          setTimeout(clearErrorMessage, 2000);
        } else {
          axios
            .post("/api/save-marks", data)
            .then((response) => {
              console.log("Submission success");
              setSuccessMessage("Submission success");
              setErrorMessage("");
              setTimeout(clearSuccessMessage, 2000);
              navigate("/displaymarks", {
                state: {
                  selectedClass: selectedClassName,
                  subjectNames: subjectNames,
                  assignedSubjects: assignedSubjects,
                  examName: examName,
                  fullMarks: subjectMarks,
                },
              });
            })
            .catch((error) => {
              console.error("Error during marks submission", error);
              setTimeout(clearErrorMessage, 2000);
            });
        }
      })
      .catch((error) => {
        console.error("Error during exam validation check", error);
        setErrorMessage("Error during exam validation check");
        setSuccessMessage("");
        setTimeout(clearErrorMessage, 2000);
      });
  };

  return (
    <>
      <h2>Select Examination</h2>
      <p> Exam Type</p>
      <select value={selectedExam} onChange={handleExamChange}>
        <option value="">Select an exam</option>
        {examOptions.map((exam) => (
          <option key={exam._id} value={exam._id}>
            {exam.examName}
          </option>
        ))}
      </select>
      <p> Class Name</p>
      <select value={selectedClass} onChange={handleclassnamechange}>
        <option value="">Select a class</option>
        {classNames.map((className) => (
          <option key={className._id} value={className._id}>
            {className.classNameS}
          </option>
        ))}
      </select>
      <h2>Assigned Subjects</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Subject Name</th>
            <th>Full Marks</th>
            <th>Pass Marks</th>
          </tr>
        </thead>
        <tbody>
          {assignedSubjects.map((subject, index) => (
            <tr key={subject._id}>
              <td>{subject.subjectName}</td>
              <td>
                <input
                  type="number"
                  value={subjectMarks[index].fullMarks}
                  onChange={(e) => handleFullMarksChange(index, e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={subjectMarks[index].passMarks}
                  onChange={(e) => handlePassMarksChange(index, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <button onClick={handleSubmission}>Submit Marks</button>
    </>
  );
}

export default AddexamDetails;
