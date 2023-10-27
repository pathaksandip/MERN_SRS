import React, { useEffect, useState } from "react";
import axios from "axios";
import Assignsubject from "./Assignsubject";
function Dclass() {
  const [classNameS, setClassName] = useState("");
  const [classNameNumeric, setClassNameNumeric] = useState("");
  const [classOptions, setClassOptions] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [messageVisible, setMessageVisible] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [showAssignSubject, setShowAssignSubject] = useState(false);
  const [expandedClasses, setExpandedClasses] = useState({});

  // State to track assigned subjects for each class
  const [assignedSubjects, setAssignedSubjects] = useState({});

  const assignSubjectsToClass = (classId, subjects) => {
    setAssignedSubjects({
      ...assignedSubjects,
      [classId]: subjects,
    });
  };

  const fetchClassDetails = async () => {
    try {
      const response = await axios.get("http://localhost:4000/classdetail");
      setClassOptions(response.data);
    } catch (error) {
      console.error("Error fetching class details", error.message);
    }
  };

  // Assign subjects to a class
  const assignSubjects = async (classId) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/classdetail/${classId}/assignsubjects`,
        {
          assignedSubjects: selectedSubjects,
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Subjects assigned successfully");
        setSelectedSubjects([]); // Clear selected subjects after assigning
        setErrorMessage("");
      } else {
        setErrorMessage("Failed to assign subjects");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
      setErrorMessage("An error occurred: " + error.message);
      setSuccessMessage("");
    }
  };

  //forsubject
  const handleAssignSubject = (subjectId) => {
    // Add or remove the selected subject ID to/from the selectedSubjects state
    if (selectedSubjects.includes(subjectId)) {
      setSelectedSubjects(selectedSubjects.filter((id) => id !== subjectId));
    } else {
      setSelectedSubjects([...selectedSubjects, subjectId]);
    }
  };
  useEffect(() => {
    if (successMessage || errorMessage) {
      setMessageVisible(true);
      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
        setMessageVisible(false);
      }, 1000); // Clear message after 1 seconds
    }
    fetchClassDetails(); // Initial fetching of class details
  }, [successMessage, errorMessage]);
  const ClassDetail = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/classdetail", {
        classNameS,
        classNameNumeric,
      });
      await fetchClassDetails();
      // Handle success here
      console.log("Class created successfully");
      // Clear the input fields after success
      setSuccessMessage("Class created successfully");
      setClassName("");
      setClassNameNumeric("");
      setErrorMessage("");
    } catch (error) {
      // Handle error here
      console.error("An error occurred:", error.message);
      setErrorMessage("An error occurred: " + error.message);
      setSuccessMessage("");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/classdetail/${id}`);

      // Update the classOptions state after successful deletion
      setClassOptions(
        classOptions.filter((classDetail) => classDetail._id !== id)
      );

      // Set success message
      setSuccessMessage("Class deleted successfully");
      setErrorMessage("");
    } catch (error) {
      // Handle error
      setErrorMessage("An error occurred while deleting: " + error.message);
      setSuccessMessage("");
    }
  };

  return (
    <>
      <div>
        <h1 style={{ marginTop: "20px" }}>Create Students class</h1>
        <form
          className="new-added-form"
          style={{
            border: "5px solid #a992ef",
            padding: "3%",
            marginTop: "1%",
            marginLeft: "3%",
            marginRight: "3%",
            backgroundColor: "whitesmoke",
          }}
        >
          <div className="row">
            <div className="col-md-4"></div>
            <div className="col-md-6">
              <div className="col-xl-6 col-lg-6 col-12 mt-2 form-group">
                <label> Add Class Name </label>
                <input
                  type="text"
                  placeholder=""
                  className="form-control"
                  value={classNameS}
                  onChange={(e) => setClassName(e.target.value)}
                />
              </div>
              <div className="col-xl-6 mt-2 col-lg-6 col-12 form-group">
                <label>ClassName in Numeric</label>
                <input
                  type="Number"
                  placeholder=""
                  className="form-control"
                  value={classNameNumeric}
                  onChange={(e) => setClassNameNumeric(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary submit ml"
                style={{ marginLeft: "15%" }}
                onClick={ClassDetail}
              >
                Submit
              </button>
            </div>
          </div>
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </form>
        <div className="table-responsive">
          <table className="table table-bordered table-striped mt-5">
            <thead className="thead-dark">
              <tr>
                <th> ClassName </th>
                <th> ClassName Numeric </th>
              </tr>
            </thead>
            <tbody>
              {classOptions.map((classDetail, index) => (
                <tr key={index}>
                  <td>{classDetail.classNameS}</td>
                  <td>{classDetail.classNameNumeric}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(classDetail._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-success ml-3"
                      style={{ marginLeft: "10px" }}
                      onClick={() =>
                        setExpandedClasses({
                          ...expandedClasses,
                          [classDetail._id]: !expandedClasses[classDetail._id],
                        })
                      }
                    >
                      {expandedClasses[classDetail._id]
                        ? "Hide Assign Subject"
                        : "Assign Subject"}
                    </button>
                    {expandedClasses[classDetail._id] && (
                      <Assignsubject
                        classId={classDetail._id}
                        subjects={selectedSubjects}
                        onAssignSubjects={assignSubjects}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Dclass;
