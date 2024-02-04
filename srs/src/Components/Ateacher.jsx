import React, { useEffect, useState } from "react";
import "./Pages/Ateacher.css";
import axios from "axios";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
function Ateacher() {
  const [tName, setTName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordData, setShowPasswordData] = useState({});
  const [temail, setTEmail] = useState("");
  const [tphone, setTPhone] = useState("");
  const [taddress, settaddress] = useState("");
  const [tgender, settgender] = useState("");
  const [tusername, settusername] = useState("");
  const [tsubject, settsubject] = useState("");
  const [tpassword, settpassword] = useState("");
  const [tdob, settdob] = useState("");
  const [teacherList, setTeacherList] = useState([]);
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [SubjectDetail, setSubjectDetail] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const [editingTeacher, setEditingTeacher] = useState({});
  const [modalTGender, setModalTGender] = useState("");

  function DateConverter(dateValue) {
    var dateString = dateValue;
    var date = new Date(dateString);
    // You can extract various components of the date
    var year = date.getFullYear();
    var month = date.getMonth() + 1; // months are zero-based
    var day = date.getDate();
    return year + "/" + month + "/" + day;
  }

  const isValidEmail = (email) => {
    if (!email) {
      return true;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    if (!password) {
      return true;
    }
    const regexNumber = /\d/;
    const regexCapitalLetter = /[A-Z]/;
    const regexSymbol = /[!@#$%^&*(),.?":{}|<>]/;
    return (
      password.length >= 8 &&
      regexNumber.test(password) &&
      regexCapitalLetter.test(password) &&
      regexSymbol.test(password)
    );
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const togglePasswordVisibilityData = (teacherId) => {
    setShowPasswordData((prevVisibility) => {
      const newVisibility = { ...prevVisibility };
      newVisibility[teacherId] = !newVisibility[teacherId];
      return newVisibility;
    });
  };

  useEffect(() => {
    const getTeacherDetails = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/getteacherdetail"
        );
        setTeacherList(response.data);
        if (editingTeacher.tgender) {
          setModalTGender(editingTeacher.tgender);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getTeacherDetails();
  }, []);
  //getsubjectdetails
  useEffect(() => {
    async function fetchSubjectdetails() {
      try {
        const response = await axios.get("http://localhost:4000/subjectdetail");
        const subjectData = response.data;
        const subjectNames = subjectData.map(
          (SubjectDetail) => SubjectDetail.SubjectName
        );
        setSubjectDetail(subjectNames);
      } catch (error) {
        console.error("Error fetching subject details", error.message);
      }
    }
    fetchSubjectdetails();
  }, []);

  const editFormHandler = async (teacherId) => {
    try {
      const teacher = teacherList.find((teacher) => teacher._id === teacherId);
      const response = await axios.put(
        `http://localhost:4000/updateteacher/${teacherId}`,
        {
          tName: teacher.tName,
          temail: teacher.temail,
          tphone: teacher.tphone,
          taddress: teacher.taddress,
          tgender: teacher.tgender,
          tusername: teacher.tusername,
          tsubject: teacher.tsubject,
          tdob: teacher.tdob,
          tpassword: teacher.tpassword,
        }
      );
      setEditingTeacherId(null);
      const updatedTeacherList = teacherList.map((teacher) =>
        teacher._id === teacherId ? response.data : teacher
      );
      setTeacherList(updatedTeacherList);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdateTeacher = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4000/updateteacher/${editingTeacher._id}`,
        {
          ...editingTeacher,
          tpassword: modalTGender,
          tdob: DateConverter(editingTeacher.tdob),
        }
      );

      const updatedTeacherList = teacherList.map((teacher) =>
        teacher._id === editingTeacher._id ? response.data : teacher
      );

      setTeacherList(updatedTeacherList);
      setEditingTeacher({}); // Clear the editingTeacher state
      handleCloseModal(); // Close the modal
    } catch (error) {
      console.log(error);
    }
  };
  const updateTeacher = (teacher) => {
    setEditingTeacher(teacher);
    settdob(DateConverter(editingTeacher.tdob));
    handleShowModal();
  };

  const Teacherdetail = async (e) => {
    e.preventDefault();
    if (
      !tName ||
      !temail ||
      !tphone ||
      !taddress ||
      !tgender ||
      !tusername ||
      !tsubject ||
      !tdob ||
      !tpassword
    ) {
      console.log("Please fill in all the fields.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:4000/teacherdetail", {
        tName,
        temail,
        tphone,
        taddress,
        tgender,
        tusername,
        tsubject,
        tdob,
        tpassword,
      });
      //clearing the input taken after response
      setTName("");
      setTEmail("");
      setTPhone("");
      settaddress("");
      settgender("");
      settusername("");
      settsubject("");
      settdob("");
      settpassword("");
      // Show success message
      const updatedTeacherResponse = await axios.get(
        "http://localhost:4000/getteacherdetail"
      );
      setTeacherList(updatedTeacherResponse.data);

      // Show success message
      setSuccessMessage("Teacher details added successfully!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };
  const removeTeacher = async (teacherId) => {
    try {
      await axios.delete(`http://localhost:4000/removeteacher/${teacherId}`);
      setTeacherList((prevList) =>
        prevList.filter((teacher) => teacher._id !== teacherId)
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="textnav">
            <h1>Add Teacher Details</h1>
            <form action="/teacherdetail" method="post" className="form1">
              <div className="row1">
                <div className="form-group">
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    value={tName}
                    onChange={(e) => setTName(e.target.value)}
                    className="form-control"
                    id="name"
                    placeholder="Enter name"
                  />
                </div>
              </div>
              <div className="form-group email">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  value={temail}
                  onChange={(e) => setTEmail(e.target.value)}
                  className={`form-control ${
                    isValidEmail(temail) ? "" : "is-invalid"
                  }`}
                  id="email"
                  placeholder="Enter email"
                  pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                  title="Enter a valid email address"
                />
                {!isValidEmail(temail) && (
                  <div className="invalid-feedback">
                    Please enter a valid email address.
                  </div>
                )}
              </div>

              <div className="form-group phone1">
                <label htmlFor="phone">Phone:</label>
                <input
                  type="text"
                  value={tphone}
                  onChange={(e) => setTPhone(e.target.value)}
                  className="form-control"
                  id="phone"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="form-group address">
                <label htmlFor="address">Address:</label>
                <textarea
                  className="form-control"
                  id="address"
                  value={taddress}
                  onChange={(e) => settaddress(e.target.value)}
                  rows="3"
                  placeholder="Enter address"
                ></textarea>
              </div>
              <div className="form-group dateofbirth">
                <label htmlFor="dob">Date of Birth:</label>
                <input
                  type="date"
                  className="form-control"
                  id="dob"
                  value={tdob}
                  onChange={(e) => settdob(e.target.value)}
                />
              </div>
              <div className="form-group phone">
                <label htmlFor="gender">Gender:</label>
                <select
                  className="form-select dropdown-toggle"
                  id="gender"
                  placeholder="Gender"
                  value={tgender}
                  onChange={(e) => settgender(e.target.value)}
                >
                  <option selected value="">
                    Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="other">Others</option>
                </select>
              </div>
              <div className="form-group phone">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  value={tusername}
                  onChange={(e) => settusername(e.target.value)}
                  className="form-control"
                  id="username"
                  placeholder="Enter username"
                />
              </div>
              <div className="form-group password">
                <label htmlFor="password">Password:</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={tpassword}
                    onChange={(e) => settpassword(e.target.value)}
                    className={`form-control ${
                      isValidPassword(tpassword) ? "" : "  is-invalid"
                    }`}
                    id="password"
                    placeholder="Set password"
                  />
                  <span
                    className="input-group-text"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                  </span>
                </div>

                {tpassword && !isValidPassword(tpassword) && (
                  <div className="invalid-feedback">Invalid Format</div>
                )}
              </div>
              <div className="form-group address1">
                <label>Subject:</label>
                <select
                  value={tsubject}
                  onChange={(e) => settsubject(e.target.value)}
                  className="form-control"
                  id="subject"
                >
                  <option value="">Please Select Subject *</option>
                  {SubjectDetail.map((subject, index) => (
                    <option key={index} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={Teacherdetail}
                type="submit"
                className="btn btn-primary submit"
              >
                Submit
              </button>
              {successMessage && (
                <div
                  className="alert alert-success "
                  role="alert"
                  style={{ marginLeft: "30%", color: "green" }}
                >
                  {successMessage}
                </div>
              )}
            </form>
            <Container className="mt-5">
              <h1>Teacher User List</h1>
              <div className="table-responsive">
                <Table striped responsive>
                  <thead className="thead-fixed">
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>Gender</th>
                      <th>Username</th>
                      <th>Subject</th>
                      <th>Date of Birth</th>
                      <th>Password</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teacherList.map((teacher) => (
                      <tr key={teacher._id} className="table-row">
                        <td>{teacher.tName}</td>
                        <td>{teacher.temail}</td>
                        <td>{teacher.tphone}</td>
                        <td>{teacher.taddress}</td>
                        <td>{teacher.tgender}</td>
                        <td>{teacher.tusername}</td>
                        <td>{teacher.tsubject}</td>
                        <td>{DateConverter(teacher.tdob)}</td>
                        <td className="d-flex ml-1">
                          {showPasswordData[teacher._id]
                            ? teacher.tpassword
                            : "********"}
                          <div>
                            <span
                              onClick={() =>
                                togglePasswordVisibilityData(teacher._id)
                              }
                            >
                              {showPasswordData[teacher._id] ? (
                                <button className="btn btn-light">
                                  <FaRegEye />
                                </button>
                              ) : (
                                <button className="btn btn-light">
                                  <FaRegEyeSlash />
                                </button>
                              )}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons d-flex ">
                            {editingTeacherId === teacher._id ? (
                              <>
                                <Button
                                  variant="primary"
                                  style={{
                                    backgroundColor: "blue",
                                    color: "whitesmoke",
                                    margin: "3px",
                                  }}
                                  onClick={() => editFormHandler(teacher._id)}
                                >
                                  Save
                                </Button>
                                <Button
                                  variant="danger"
                                  style={{
                                    backgroundColor: "red",
                                    color: "whitesmoke",
                                    margin: "3%",
                                  }}
                                  onClick={() => setEditingTeacherId(null)}
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="outline-success"
                                  style={{ marginRight: "5px" }}
                                  onClick={() => updateTeacher(teacher)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="danger"
                                  style={{
                                    backgroundColor: "red",
                                    color: "whitesmoke",
                                  }}
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        "Are you sure you want to remove this teacher?"
                                      )
                                    ) {
                                      removeTeacher(teacher._id);
                                    }
                                  }}
                                >
                                  Remove
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Container>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Teacher Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                value={editingTeacher.tName || ""}
                onChange={(e) =>
                  setEditingTeacher({
                    ...editingTeacher,
                    tName: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                value={editingTeacher.temail || ""}
                onChange={(e) =>
                  setEditingTeacher({
                    ...editingTeacher,
                    temail: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                value={editingTeacher.tphone || ""}
                onChange={(e) =>
                  setEditingTeacher({
                    ...editingTeacher,
                    tphone: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                value={editingTeacher.taddress || ""}
                onChange={(e) =>
                  setEditingTeacher({
                    ...editingTeacher,
                    taddress: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formGender">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                as="select"
                value={editingTeacher.tgender} // Use the teacher's gender value here
                onChange={(e) =>
                  setEditingTeacher({
                    ...editingTeacher,
                    tgender: e.target.value,
                  })
                }
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                value={editingTeacher.tusername || ""}
                onChange={(e) =>
                  setEditingTeacher({
                    ...editingTeacher,
                    tusername: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Control
              type="Date"
              value={editingTeacher.tdob || ""} // Use the teacher's dob value here
              onChange={(e) =>
                setEditingTeacher({
                  ...editingTeacher,
                  tdob: e.target.value,
                })
              }
            />

            <Form.Group controlId="formName">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder=""
                value={editingTeacher.tpassword}
                onChange={(e) =>
                  setEditingTeacher({
                    ...editingTeacher,
                    tpassword: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                as="select"
                value={editingTeacher.tpassword}
                onChange={(e) =>
                  setEditingTeacher({
                    ...editingTeacher,
                    tpassword: e.target.value,
                  })
                }
              >
                {SubjectDetail.map((className, index) => (
                  <option key={index} value={className}>
                    {className}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateTeacher}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Ateacher;
