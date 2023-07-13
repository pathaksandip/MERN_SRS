import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import ClassIcon from "@mui/icons-material/Class";
import "./Dhome.css";

function Dhome() {
  return (
    <div>
      <div className="hometext">
        <h1>Welcome to Result Management System</h1>
        <p className="text">
          This is the dashboard for managing student results, classes, teachers,
          and generating reports.
        </p>
      </div>
      <div className="homemain">
        <div>
          <h2>
            <PersonIcon />
            <span className="a">Add teacher</span>
          </h2>
          <p className="d">
            Create rich course content and coaching products for your students.
            When you give them a pricing plan, they'll appear on your site!
          </p>
        </div>
        ​
        <div>
          <h4>
            <SchoolIcon />
            <span className="b">Add students</span>
          </h4>
          <p className="e">
            Create rich course content and coaching products for your students.
            When you give them a pricing plan, they'll appear on your site!
          </p>
        </div>
        <div>
          <h3>
            <ClassIcon />
            <span className="c">Add classes</span>
          </h3>
          <p className="f">
            Create rich course content and coaching products for your students.
            When you give them a pricing plan, they'll appear on your site!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dhome;
