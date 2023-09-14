import React from "react";
import "./Pages/Aboutus.css";

function AboutUs() {
  return (
    <div>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-4">
            <img
              src={"/images/logo.png"}
              alt="SRSLogo"
              className="img-fluid"
              id="logo"
            />
          </div>
          <div className="col-md-8">
            <nav className="navbar navbar-expand-md navbar-" id="aboutusmain">
              <h2>About Us</h2>
            </nav>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        <div className="row">
          <div className="col-md-12">
            <h3>About Us</h3>
            <p id="para">
              School Result System (SRS) is a web-based application program
              designed to monitor and preserve academic records across multiple
              platforms. One of the key features of SRS is its ability to
              quickly process and generate results, which helps alleviate the
              stress and time-constraints associated with result preparation.
              The software maintains a comprehensive database that includes data
              on students, teachers, classes, class teachers, subjects, periods,
              subject-specific marks collecting sheets, class-specific results,
              and various other reports.
            </p>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        <div className="row">
          <div className="col-md-3">
            <img src={"/images/bijay.png"} className="img-fluid" />
            <p className="bijay">Bijay Ale Magar</p>
            <p className="bijay">Front-End Developer</p>
          </div>
          <div className="col-md-3">
            <img src={"/images/milan .png"} className="img-fluid" />
            <p className="bijay">Milan Thapa Magar</p>
            <p className="bijay">System Designer</p>
          </div>
          <div className="col-md-3">
            <img src={"/images/sandip.png"} className="img-fluid" />
            <p className="bijay">Sandip Pathak</p>
            <p className="bijay">Backend Developer</p>
          </div>
          <div className="col-md-3">
            <img src={"/images/suman .png"} className="img-fluid" />
            <p className="bijay">Suman Pantha</p>
            <p className="bijay">System Analyst</p>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6 mx-auto">
            <div>
              <h1>For more info:</h1>
            </div>
            <div className="news">
              <img src={"/images/logo.png"} alt="logo" className="logo2" />
              <div className="srs">
                <h5>School Result System (SRS)</h5>
                <p className="team">Team Alpha</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Sign up for our Newsletter</h5>
                <form
                  action="https://example.com/submit-newsletter"
                  method="post"
                >
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="Your Email"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <img
              src={"/images/img (1).png"}
              alt="design"
              className="img-fluid"
              id="design"
            />
          </div>
        </div>
      </div>

      <div className="container mt-5">
        <div className="row">
          <div className="col-md-12">
            <footer className="text-white text-center py-1" id="footer">
              <i className="bi bi-facebook"></i>
              <p>
                © SchoolResultSystem 2023, All Rights Reserved | Privacy | Terms
                of Service
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
