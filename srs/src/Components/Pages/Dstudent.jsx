import axios from "axios";
import React, { useEffect, useState } from "react";

function Dstudent() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [gender, setGender] = useState("");
  const [sdob, setSdob] = useState("");
  const [roll, setRoll] = useState("");
  const [email, setEmail] = useState("");
  const [studentclass, setStudentClass] = useState("");
  const [admissionID, setAdmissionID] = useState("");
  const [phone, setPhone] = useState("");
  const [guardianname, setGuardianName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const studentdata = async (e) => {
    e.preventDefault();
    const resetForm = () => {
      setFname("");
      setLname("");
      setGender("");
      setSdob("");
      setRoll("");
      setEmail("");
      setStudentClass("");
      setAdmissionID("");
      setPhone("");
      setGuardianName("");
    };

    // Validation
    if (
      !fname ||
      !lname ||
      !gender ||
      !sdob ||
      !roll ||
      !studentclass ||
      !admissionID ||
      !phone ||
      !guardianname
    ) {
      setErrorMessage("Please fill the details.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:4000/studentsdetails",
        {
          fname,
          lname,
          gender,
          sdob,
          roll,
          email,
          studentclass,
          admissionID,
          phone,
          guardianname,
        }
      );
      console.log(response.data);
      setSuccessMessage("Student added successfully!");
      setErrorMessage("");
      resetForm();
    } catch (error) {
      console.log("Error:", error.message);
      if (error.response) {
        console.log("Response:", error.response.data);
        setErrorMessage("Admission ID already exists!");
      }
    }
  };

  return (
    <div>
      <div className="dashboard-content-one">
        <h1 style={{ marginTop: "20px" }}>Add Students</h1>
        <form
          className="new-added-form"
          style={{
            border: " 5px solid #a992ef",
            padding: "3%",
            marginTop: "5%",
            marginLeft: "3%",
            marginRight: "3%",
            backgroundColor: "whitesmoke",
          }}
        >
          <div className="row">
            <div className="col-xl-3 col-lg-6 col-12 form-group">
              <label>First Name *</label>
              <input
                type="text"
                placeholder=""
                className="form-control"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
              />
            </div>
            <div className="col-xl-3 col-lg-6 col-12 form-group">
              <label>Last Name *</label>
              <input
                type="text"
                placeholder=""
                className="form-control"
                value={lname}
                onChange={(e) => setLname(e.target.value)}
              />
            </div>
            <div className="col-xl-3 col-lg-6 col-12 form-group">
              <label>Gender *</label>
              <select
                className="select2"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Please Select Gender *</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
            </div>
            <div className="col-xl-3 col-lg-6 col-12 form-group">
              <label>Date Of Birth *</label>
              <input
                type="date"
                placeholder="dd/mm/yyyy"
                className="form-control air-datepicker"
                data-position="bottom right"
                value={sdob}
                onChange={(e) => setSdob(e.target.value)}
              />
              <i className="far fa-calendar-alt"></i>
            </div>
            <div className="col-xl-3 col-lg-6 col-12 form-group">
              <label>Roll</label>
              <input
                type="text"
                placeholder=""
                className="form-control"
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
              />
            </div>
            <div className="col-xl-3 col-lg-6 col-12 form-group">
              <label>E-Mail</label>
              <input
                type="email"
                placeholder=""
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="col-xl-3 col-lg-6 col-12 form-group">
              <label>Class *</label>
              <select
                className="select2"
                value={studentclass}
                onChange={(e) => setStudentClass(e.target.value)}
              >
                <option value="">Please Select Class *</option>
                <option value="Play">Play</option>
                <option value="Nursery">Nursery</option>
                <option value="One">One</option>
                <option value="Two">Two</option>
                <option value="Three">Three</option>
                <option value="Four">Four</option>
                <option value="Five">Five</option>
                <option value="Six">six</option>
                <option value="Seven">seven</option>
                <option value="Eight">Eight</option>
                <option value="Nine">Nine</option>
                <option value="Ten">Ten</option>
              </select>
            </div>
            <div className="col-xl-3 col-lg-6 col-12 form-group">
              <label>Admission ID</label>
              <input
                type="text"
                placeholder=""
                className="form-control"
                value={admissionID}
                onChange={(e) => setAdmissionID(e.target.value)}
              />
            </div>
            <div className="col-xl-3 col-lg-6 col-12 form-group">
              <label>Phone</label>
              <input
                type="text"
                placeholder=""
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="col-xl-3 col-lg-6 col-12 form-group">
              <label>Guardian's Name</label>
              <input
                type="text"
                placeholder=""
                className="form-control"
                value={guardianname}
                onChange={(e) => setGuardianName(e.target.value)}
              />
            </div>
            <div className="col-12 form-group mg-t-8">
              <button
                onClick={studentdata}
                type="submit"
                className="btn btn-primary submit"
                style={{ marginLeft: "40% " }}
              >
                Submit
              </button>
            </div>
            {successMessage && (
              <div style={{ marginTop: "10px", color: "green" }}>
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div style={{ marginTop: "10px", color: "red" }}>
                {errorMessage}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Dstudent;
