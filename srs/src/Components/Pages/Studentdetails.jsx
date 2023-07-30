import axios from "axios";
import React, { useEffect, useState } from "react";
function Studentdetails() {
  const [students, setStudents] = useState([]);
  useEffect(() => {
    fetchStudentData();
  }, []);
  function DateConverter(dateValue) {
    var dateString = dateValue;
    var date = new Date(dateString);
    // You can extract various components of the date
    var year = date.getFullYear();
    var month = date.getMonth() + 1; // months are zero-based
    var day = date.getDate();
    return year + "/" + month + "/" + day;
  }
  const fetchStudentData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/studentsdetails");
      // console.log(response.data);
      setStudents(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const removestudent = async (studentId) => {
    try {
      await axios.delete(`http://localhost:4000/removestudent/${studentId}`);
      setStudents((prevList) =>
        prevList.filter((student) => student._id !== studentId)
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="header m-3">
        <h1>All Student Details</h1>
        <form className="mg-b-20">
          <div className="row gutters-8">
            <div className="col-3-xxxl col-xl-3 col-lg-3 col-12 form-group">
              <input
                type="text"
                placeholder="Search by Roll ..."
                className="form-control"
              />
            </div>
            <div className="col-4-xxxl col-xl-4 col-lg-3 col-12 form-group">
              <input
                type="text"
                placeholder="Search by  Name ..."
                className="form-control"
              />
            </div>
            <div className="col-4-xxxl col-xl-3 col-lg-3 col-12 form-group">
              <input
                type="text"
                placeholder="Search by class ..."
                className="form-control"
              />
            </div>
            <div className="col-1-xxxl col-xl-2 col-lg-3 col-12 form-group mt-1">
              <button type="submit" className="fw-btn-fill btn-gradient-yellow">
                SEARCH
              </button>
            </div>
          </div>
        </form>
        <form>
          <div className="table-responsive">
            <table className="table display data-table text-nowrap mt-5">
              <thead>
                <tr>
                  <th> Name</th>
                  <th>Address</th>
                  <th>Gender</th>
                  <th>DOB</th>
                  <th>Roll NO</th>
                  <th>Email</th>
                  <th>class</th>
                  <th>Admission ID</th>
                  <th>Phone No.</th>
                  <th>Guardian Name</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.fname} </td>
                    <td>{student.lname}</td>
                    <td>{student.gender}</td>
                    <td> {DateConverter(student.sdob)}</td>
                    <td>{student.roll}</td>
                    <td>{student.email}</td>
                    <td>{student.studentclass}</td>
                    <td>{student.admissionID}</td>
                    <td>{student.phone}</td>
                    <td>{student.guardianname}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        style={{
                          backgroundColor: "Red",
                          color: "whitesmoke",
                          margin: "3%",
                        }}
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to remove this teacher?"
                            )
                          ) {
                            removestudent(student._id);
                          }
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Studentdetails;
