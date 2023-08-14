import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Modal, Form } from "react-bootstrap";
import { Button } from "react-bootstrap";

function Studentdetails() {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [classSearchQuery, setClassSearchQuery] = useState("");
  const [rollSearchQuery, setRollSearchQuery] = useState("");
  const [updatedFirstName, setUpdatedFirstName] = useState("");
  const [updatedLastName, setUpdatedLastName] = useState("");
  const [updatedRoll, setupdatedRoll] = useState("");
  const [updatedDob, setUpdatedDob] = useState("");
  const [updatedClass, setUpdatedClass] = useState("");
  const [updatedGender, setUpdatedGender] = useState("");
  const [updatedStudent, setUpdatedStudent] = useState({});
  const [updatedGuardianName, setUpdatedGuardianName] = useState("");
  const [updatedGuardianContact, setUpdatedGuardianContact] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [classOptions, setClassOptions] = useState([]);


  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const fetchStudentData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/studentsdetails");
      setStudents(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  function DateConverter(dateValue) {
    if (!dateValue) return ""; // Handle the case when dateValue is empty or null
    const date = new Date(dateValue);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

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

  const updateStudent = (student) => {
    handleShowModal();
    setUpdatedFirstName(student.fname);
    setUpdatedLastName(student.lname);
    setupdatedRoll(student.roll.toString());
    setUpdatedDob(DateConverter(student.sdob));
    setUpdatedClass(student.studentclass);
    setUpdatedGender(student.gender);
    setUpdatedGuardianName(student.guardianname);
    setUpdatedGuardianContact(student.phone);
    setUpdatedStudent(student);
  };
  useEffect(() => {
    async function fetchClassDetails() {
      try {
        const response = await axios.get("http://localhost:4000/classdetail");
        const classDetails = response.data;
        const classNames = classDetails.map(
          (classDetail) => classDetail.classNameS
        );
        setClassOptions(classNames);
      } catch (error) {
        console.error("Error fetching class details", error.message);
      }
    }
    fetchClassDetails();
  }, []);
  const handleUpdateStudent = async () => {
    try {
      const updatedData = {
        fname: updatedFirstName,
        lname: updatedLastName,
        roll: parseInt(updatedRoll),
        sdob: updatedDob,
        studentclass: updatedClass,
        gender: updatedGender,
        guardianname: updatedGuardianName,
        phone: updatedGuardianContact,
      };

      const response = await axios.put(
        `http://localhost:4000/updatestudent/${updatedStudent._id}`,
        updatedData
      );
      if (response.status === 200) {
        handleCloseModal();
        fetchStudentData();
      }
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
                value={rollSearchQuery}
                onChange={(e) => setRollSearchQuery(e.target.value)}
              />
            </div>
            <div className="col-4-xxxl col-xl-4 col-lg-3 col-12 form-group">
              <input
                type="text"
                placeholder="Search by  Name ..."
                className="form-control"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="col-4-xxxl col-xl-3 col-lg-3 col-12 form-group">
              <input
                type="text"
                placeholder="Search by class ..."
                className="form-control"
                value={classSearchQuery}
                onChange={(e) => setClassSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </form>
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
              {students
                .filter(
                  (student) =>
                    student.fname
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) &&
                    student.studentclass
                      .toLowerCase()
                      .includes(classSearchQuery.toLowerCase()) &&
                    student.roll
                      .toString()
                      .toLowerCase()
                      .includes(rollSearchQuery.toLowerCase())
                )
                .map((student) => (
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
                      <Button
                        variant="outline-success"
                        style={{ marginRight: "5px" }}
                        onClick={() => updateStudent(student)}
                      >
                        Edit
                      </Button>
                    </td>
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
                              "Are you sure you want to remove this student?"
                            )
                          ) {
                            removestudent(student._id);
                          } else {
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
      </div>
      {/* Modal for editing student details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Student Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                value={updatedFirstName}
                onChange={(e) => setUpdatedFirstName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formLastName">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                value={updatedLastName}
                onChange={(e) => setUpdatedLastName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formrollno">
              <Form.Label>Roll No</Form.Label>
              <Form.Control
                type="Number"
                placeholder="Enter Roll No"
                value={updatedRoll}
                onChange={(e) => setupdatedRoll(e.target.value)}
              />
              <Form.Group controlId="formClass">
                <Form.Label>Class</Form.Label>
                <Form.Control
                  as="select"
                  value={updatedClass}
                  onChange={(e) => setUpdatedClass(e.target.value)}
                >
                     {classOptions.map((className, index) => (
                  <option key={index} value={className}>
                    {className}
                  </option>
                ))}
                  {/* <option value="Play">Play</option>
                  <option value="Nursery">Nursery</option>
                  <option value="One">One</option>
                  <option value="Two">Two</option>
                  <option value="Three">Three</option>
                  <option value="Four">Four</option>
                  <option value="Five">Five</option>
                  <option value="Six">Six</option>
                  <option value="Seven">Seven</option>
                  <option value="Eight">Eight</option>
                  <option value="Nine">Nine</option>
                  <option value="Ten">Ten</option> */}
                </Form.Control>
              </Form.Group>
            </Form.Group>
            <Form.Group controlId="formGender">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                as="select"
                value={updatedGender}
                onChange={(e) => setUpdatedGender(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formDob">
              <Form.Label>DOB</Form.Label>
              <Form.Control
                type="date"
                value={updatedDob}
                onChange={(e) => setUpdatedDob(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formGuardianName">
              <Form.Label>Guardian Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter guardian name"
                value={updatedGuardianName}
                onChange={(e) => setUpdatedGuardianName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formGuardianContact">
              <Form.Label>Guardian Contact</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter guardian contact"
                value={updatedGuardianContact}
                onChange={(e) => setUpdatedGuardianContact(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateStudent}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Studentdetails;
