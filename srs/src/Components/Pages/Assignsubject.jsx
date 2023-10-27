import React, { useState, useEffect } from "react";
import axios from "axios";

function Assignsubject({ classId }) {
  const [subjects, setSubjects] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState({});

  const handleSelect = (subjectId, subjectName) => {
    setSelectedSubjects((prevSelected) => ({
      ...prevSelected,
      [classId]: prevSelected[classId]
        ? [...prevSelected[classId], { subjectId, subjectName }]
        : [{ subjectId, subjectName }],
    }));
  };

  const fetchSubjectdetails = async () => {
    try {
      const response = await axios.get("http://localhost:4000/subjectdetail");
      // Assuming the response data is an array of subjects
      const fetchedSubjects = response.data;
      setSubjects(fetchedSubjects); // Update the subjects state with the fetched data
    } catch (error) {
      console.error("Error fetching Subject Details", error.message);
    }
  };

  useEffect(() => {
    fetchSubjectdetails();
  }, []);

  const assignSubjectsToClass = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4000/classdetail/${classId}/assignsubjects`,
        {
          assignedSubjects: selectedSubjects[classId] || [], // Send selected subjects for the specific class
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Subjects assigned successfully");
        // Clear the selectedSubjects array for this class
        setSelectedSubjects({ ...selectedSubjects, [classId]: [] });
      } else {
        setErrorMessage("Failed to assign subjects");
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
      setErrorMessage("An error occurred: " + error.message);
    }
  };

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Subject Code</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => (
            <tr key={subject._id}>
              <td>{subject.SubjectName}</td>
              <td>{subject.SubjectCode}</td>
              <td>
                <input
                  type="checkbox"
                  value={subject._id}
                  checked={(selectedSubjects[classId] || []).some(
                    (item) => item.subjectId === subject._id
                  )}
                  onChange={() =>
                    handleSelect(subject._id, subject.SubjectName)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-primary" onClick={assignSubjectsToClass}>
        Assign
      </button>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
}

export default Assignsubject;
