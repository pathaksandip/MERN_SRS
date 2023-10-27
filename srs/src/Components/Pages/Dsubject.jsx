import React, { useEffect, useState } from "react";
import axios from "axios";
function Dsubject() {
  const [SubjectName, SetSubjectName] = useState("");
  const [SubjectCode, SetSubjectCode] = useState("");
  const [SubjectCreditHour, SetSubjectCreditHour] = useState("");
  const [SubjectDetail, setSubjectDetail] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [messageVisible, setMessageVisible] = useState(false);

  const fetchSubjectdetails = async () => {
    try {
      const Response = await axios.get("http://localhost:4000/subjectdetail");
      setSubjectDetail(Response.data);
    } catch (error) {
      console.error("Error fetching Subject Details", error.message);
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
    fetchSubjectdetails(); // Initial fetching of class details
  }, [successMessage, errorMessage]);
  const SubDetail = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/subjectdetail", {
        SubjectName,
        SubjectCode,
        SubjectCreditHour,
      });
      console.log("Subject  created successfully");
      setSuccessMessage("Subject created successfully");
      SetSubjectCode("");
      SetSubjectCreditHour("");
      SetSubjectName("");
      setErrorMessage("");
    } catch (error) {
      console.error("An error Occurerd:", error.message);
      setErrorMessage("An error occurred: " + error.message);
      setSuccessMessage("");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/subjectdetail/${id}`);

      // Update the classOptions state after successful deletion
      setSubjectDetail(
        SubjectDetail.filter((SubjectDetail) => SubjectDetail._id !== id)
      );

      // Set success message
      setSuccessMessage("Subject deleted successfully");
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
        <h1>Create Subject</h1>
        <form
          style={{
            border: "5px solid #a992ef",
            padding: "3%",
            marginTop: "1%",
            marginLeft: "3%",
            marginRight: "10%",
            backgroundColor: "whitesmoke",
          }}
        >
          <div className="row">
            <div className="col-md-4"></div>
            <div className="col-md-6 ">
              <div className="col-xl-6 col-lg-6 col-12 mt-2 form-group">
                <label> Add Subject </label>
                <input
                  type="text"
                  placeholder=""
                  className="form-control"
                  value={SubjectName}
                  onChange={(e) => SetSubjectName(e.target.value)}
                />
              </div>
              <div className="col-xl-6 col-lg-6 col-12 mt-2 form-group">
                <label> Add Subject Code </label>
                <input
                  type="text"
                  placeholder=""
                  className="form-control"
                  value={SubjectCode}
                  onChange={(e) => SetSubjectCode(e.target.value)}
                />
              </div>
              <div className="col-xl-6 col-lg-6 col-12 mt-2 form-group">
                <label> Subject Credit Hour </label>
                <input
                  type="number"
                  placeholder=""
                  className="form-control"
                  value={SubjectCreditHour}
                  onChange={(e) => SetSubjectCreditHour(e.target.value)}
                />
                {successMessage && (
                  <p style={{ color: "green" }}>{successMessage}</p>
                )}
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
              </div>
              <button
                type="submit"
                className="btn btn-primary submit ml"
                style={{ marginLeft: "15%" }}
                onClick={SubDetail}
              >
                Submit
              </button>
            </div>

            <div className="col-md-2"></div>
          </div>
        </form>
        <div className="table-responsive">
          <table className="table table-bordered table-striped mt-5">
            <thead className="thead-dark">
              <tr>
                <th> SubjectName </th>
                <th> Subject Code </th>
                <th> Subject Credit Hour </th>
              </tr>
            </thead>
            <tbody>
              {SubjectDetail.map((subject, index) => (
                <tr key={index}>
                  <td>{subject.SubjectName}</td>
                  <td>{subject.SubjectCode}</td>
                  <td>{subject.SubjectCreditHour}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(subject._id)}
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
      
    </>
  );
}

export default Dsubject;
