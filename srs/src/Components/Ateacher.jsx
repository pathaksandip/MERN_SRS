import React, { useEffect, useState } from "react";
import "./Pages/Ateacher.css";
import axios from "axios";

function Ateacher() {
  const [tName, setTName] = useState("");
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

  function DateConverter(dateValue) {
    var dateString = dateValue;
    var date = new Date(dateString);
    // You can extract various components of the date
    var year = date.getFullYear();
    var month = date.getMonth() + 1; // months are zero-based
    var day = date.getDate();
    return year + "/" + month + "/" + day;
  }
  useEffect(() => {
    const getTeacherDetails = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/getteacherdetail"
        );
        setTeacherList(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getTeacherDetails();
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
                  className="form-control"
                  id="email"
                  placeholder="Enter email"
                />
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
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
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
              <div className="form-group phone">
                <label htmlFor="password">Password:</label>
                <input
                  type="text"
                  value={tpassword}
                  onChange={(e) => settpassword(e.target.value)}
                  className="form-control"
                  id="password"
                  placeholder="Set password"
                />
              </div>
              <div className="form-group address1">
                <label htmlFor="subject">Subject:</label>
                <input
                  type="text"
                  value={tsubject}
                  onChange={(e) => settsubject(e.target.value)}
                  className="form-control"
                  id="subject"
                  placeholder="Enter subject"
                />
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
            <div className="container mt-5">
              <h1>Teacher User List</h1>
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Gender</th>
                    <th>Username</th>
                    <th>subject</th>
                    <th>dob</th>
                    <th>password</th>
                  </tr>
                </thead>
                <tbody>
                  {teacherList.map((teacher) => (
                    <tr key={teacher._id}>
                      <td>
                        {editingTeacherId === teacher._id ? (
                          <input
                            type="text"
                            value={teacher.tName}
                            size={tName.length > 10 ? tName.length : 10}
                            onChange={(e) =>
                              setTeacherList(
                                teacherList.map((t) =>
                                  t._id === teacher._id
                                    ? { ...t, tName: e.target.value }
                                    : t
                                )
                              )
                            }
                          />
                        ) : (
                          teacher.tName
                        )}
                      </td>
                      <td>{teacher.temail}</td>
                      <td>
                        {editingTeacherId === teacher._id ? (
                          <input
                            type="text"
                            size={tphone.length > 10 ? tphone.length : 10}
                            value={teacher.tphone}
                            onChange={(e) =>
                              setTeacherList(
                                teacherList.map((t) =>
                                  t._id === teacher._id
                                    ? { ...t, tphone: e.target.value }
                                    : t
                                )
                              )
                            }
                          />
                        ) : (
                          teacher.tphone
                        )}
                      </td>
                      <td>{teacher.taddress}</td>
                      <td>{teacher.tgender}</td>
                      <td>
                        {editingTeacherId === teacher._id ? (
                          <input
                            type="text"
                            value={teacher.tusername}
                            size={tusername.length > 10 ? tusername.length : 10}
                            onChange={(e) =>
                              setTeacherList(
                                teacherList.map((t) =>
                                  t._id === teacher._id
                                    ? { ...t, tusername: e.target.value }
                                    : t
                                )
                              )
                            }
                          />
                        ) : (
                          teacher.tusername
                        )}
                      </td>
                      <td>{teacher.tsubject}</td>

                      <td>
                        {editingTeacherId === teacher._id ? (
                          <input
                            type="date"
                            value={teacher.tdob}
                            size={tdob.length > 5 ? tdob.length : 5}
                            onChange={(e) =>
                              setTeacherList(
                                teacherList.map((t) =>
                                  t._id === teacher._id
                                    ? { ...t, tdob: e.target.value }
                                    : t
                                )
                              )
                            }
                          />
                        ) : (
                          DateConverter(teacher.tdob)
                        )}
                      </td>
                      <td>
                        {editingTeacherId === teacher._id ? (
                          <input
                            type="text"
                            value={teacher.tpassword}
                            size={tpassword.length > 10 ? tpassword.length : 10}
                            onChange={(e) =>
                              setTeacherList(
                                teacherList.map((t) =>
                                  t._id === teacher._id
                                    ? { ...t, tpassword: e.target.value }
                                    : t
                                )
                              )
                            }
                          />
                        ) : (
                          teacher.tpassword
                        )}
                      </td>
                      <td>
                        {editingTeacherId === teacher._id ? (
                          <>
                            <button
                              className="btn btn-primary"
                              style={{
                                backgroundColor: "blue",
                                color: "whitesmoke",
                                margin: "3px",
                              }}
                              onClick={() => editFormHandler(teacher._id)}
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-danger"
                              style={{
                                backgroundColor: "Red",
                                color: "whitesmoke",
                                margin: "3%",
                              }}
                              onClick={() => setEditingTeacherId(null)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn btn-primary"
                              style={{
                                backgroundColor: "blue",
                                color: "whitesmoke",
                              }}
                              onClick={() => setEditingTeacherId(teacher._id)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger"
                              style={{
                                backgroundColor: "Red",
                                color: "whitesmoke",
                                marginLeft: "2px",
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
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ateacher;
