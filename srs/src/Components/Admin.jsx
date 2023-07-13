import axios from "axios";
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
function Admin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState("");
  console.log(error);

  const loginAdmin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/login", {
        username,
        password,
      });
      {
        if (response.status === 200) {
          setRedirect(true);
        } else {
          setError("Incorrect username and password");
        }
        // response.status === 200 ? setRedirect(true) : setRedirect(false);
      }
    } catch (error) {
      console.log(error);
      setError("Incorrect username and password");
    }
  };

  if (redirect) {
    return <Navigate to={"/dashboard"} />;
  }
  return (
    <div>
      <div className="container mt-3">
        <div className="row">
          <div className="col-md-6 leftside">
            <p id="tname">MBSS</p>
            <img src={"/images/logo.png"} className="logo" alt="logo" />
            <h2 className="quote">
              Transforming Education:Effortlessly Accurate Online School
              Results!
            </h2>
          </div>
          <div className="col-md-6 rightside">
            <form action="/loginadmin" method="post" className="login">
              <h1 className="row justify-content-center">
                School Result System
              </h1>
              <h5 className="row justify-content-center"> Admin Panel</h5>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control"
                  placeholder="Enter your username"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  placeholder="Enter your password"
                />
              </div>
              <div className="text-center d-flex flex-column">
                <button
                  onClick={loginAdmin}
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

export default Admin;
