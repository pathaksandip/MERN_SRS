import React, { useState } from "react";
import "./Teacher.css";
import axios from "axios";
import {Link, Navigate } from "react-router-dom";

function Teacher() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState("");

  const loginTeacher = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/login/teacher", {
        username,
        password,
      });
      {
        if (response.status === 200) {
          setRedirect(true);
        }
        console.log(response);
      }
    } catch (error) {
      console.log(error);
      setError("Incorrect username and password");
    }
  };
  if (redirect) {
    return <Navigate to={"/dteacher"} />;
  }

  return (
    <div>
      <div className="container mt-3">
        <div className="row">
          <div className="col-md-6 leftside">
            <p id="tname">MBSS</p>
          <Link to={"/"}>  <img src={"/images/logo.png"} className="logo" alt="logo" /> </Link>
            <h2 className="quote">
              Transforming Education:Effortlessly Accurate Online School
              Results!
            </h2>
          </div>
          <div className="col-md-6 rightside">
            <form className="login">
              <h1 className="row justify-content-center">
                School Result System
              </h1>
              <h5 className="row justify-content-center"> Teacher Panel</h5>
              <div className="mb-3">
                <label for="username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control"
                  id="username"
                  name="username1"
                  placeholder="Enter your username"
                />
              </div>
              <div className="mb-3">
                <label for="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  name="password1"
                  placeholder="Enter your password"
                />
              </div>
              <div className="text-center">
                <button
                  onClick={loginTeacher}
                  href="dashboard.html"
                  type="submit"
                  className="btn btn-primary"
                >
                  Log In
                </button>
                <p className="text-center text-danger">{error}</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Teacher;
