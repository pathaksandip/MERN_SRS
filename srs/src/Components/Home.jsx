import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";
function Home() {
  return (
    <div>
      <div className="container-fluid mt-5">
        <div className="row">
          <div className="col-md-6">
            <div className="main">
              <img src={"/images/logo.png"} className="logo" alt="Logo" />
              <img src={"/images/srshome.png"} className="secondimage" alt="" />
            </div>
          </div>
          <div className="col-md-6">
            <Link to={"/student"} className="Navone">
              Student
            </Link>
            <Link to={"/admin"} className="Navone">
              Admin
            </Link>
            <Link to={"/teacher"} className="Navone">
              Teacher
            </Link>
            <Link to={"/aboutus"} className="Navone">
              About Us
            </Link>
            <h1 className="head">SRS</h1>
            <h6 className="head1">School Result System</h6>
            <p className="copyright">
              @All rights reserve to School Result System ll 2023
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
