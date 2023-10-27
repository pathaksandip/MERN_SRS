import { React, useState } from "react";
import "./Pages/Aboutus.css";
import axios from "axios";
import { Link } from "react-router-dom";
function AboutUs() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [error, setError] = useState(null);
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("/message", {
        messages: message,
        email,
      });
      console.log(response.data);
      setMessageSent(true);
      // Clear the message and email fields
      setMessage("");
      setEmail("");
      setTimeout(() => {
        setMessageSent(false);
      }, 1000);
    } catch (error) {
      console.error(error);
      setError("Please fill up the fields");
    }
    setTimeout(() => {
      setError(null);
    }, 1000);
  };
  return (
    <div>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-4">
            <Link to={"/"}>
              <img
                src={"/images/logo.png"}
                alt="SRSLogo"
                className="img-fluid"
                id="logo"
              />
            </Link>
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
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label for="message">Message Box</label>
                    <textarea
                      class="form-control"
                      rows="5"
                      id="comment"
                      placeholder="Enter your message"
                      value={message}
                      onChange={handleMessageChange}
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="Your Email"
                      value={email}
                      onChange={handleEmailChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Subscribe
                  </button>
                </form>
                {messageSent && (
                  <div className="container mt-3">
                    <div className="alert alert-success">
                      Message sent successfully!
                    </div>
                  </div>
                )}
                {error && (
                  <div className="container mt-3">
                    <div className="alert alert-danger">{error}</div>
                  </div>
                )}
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
