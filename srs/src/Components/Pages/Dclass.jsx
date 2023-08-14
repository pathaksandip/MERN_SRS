import React, { useEffect, useState } from "react";
import axios from "axios";

function Dclass() {
  const [classNameS, setClassName] = useState("");
  const [classNameNumeric, setClassNameNumeric] = useState("");
  const [classOptions, setClassOptions] = useState([]);

  const ClassDetail = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/classdetail", {
        classNameS,
        classNameNumeric,
      });
      // Handle success here
      console.log("Class created successfully");
      // Clear the input fields after success
      setClassName("");
      setClassNameNumeric("");
    } catch (error) {
      // Handle error here
      console.error("An error occurred:", error.message);
    }
  };
  useEffect(() => {
    async function fetchClassDetails() {
      try {
        const response = await axios.get("http://localhost:4000/classdetail");
        setClassOptions(response.data);
      } catch (error) {
        console.error("Error fetching class details", error.message);
      }
    }
    fetchClassDetails();
  }, []);
  return (
    <>
      <div>
        <h1 style={{ marginTop: "20px" }}>Create Students class</h1>
        <form
          className="new-added-form"
          style={{
            border: "5px solid #a992ef",
            padding: "3%",
            marginTop: "1%",
            marginLeft: "3%",
            marginRight: "3%",
            backgroundColor: "whitesmoke",
          }}
        >
          <div className="row">
            <div className="col-md-4"></div>
            <div className="col-md-6">
              <div className="col-xl-6 col-lg-6 col-12 mt-2 form-group">
                <label> Add Class Name </label>
                <input
                  type="text"
                  placeholder=""
                  className="form-control"
                  value={classNameS}
                  onChange={(e) => setClassName(e.target.value)}
                />
              </div>
              <div className="col-xl-6 mt-2 col-lg-6 col-12 form-group">
                <label>ClassName in Numeric</label>
                <input
                  type="Number"
                  placeholder=""
                  className="form-control"
                  value={classNameNumeric}
                  onChange={(e) => setClassNameNumeric(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary submit ml"
                style={{ marginLeft: "15%" }}
                onClick={ClassDetail}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
        <div className="table-responsive">
          <table className="table display data-table text-nowrap mt-5">
            <thead>
              <tr>
                <th> ClassName </th>
                <th> ClassName Numeric </th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Dclass;
