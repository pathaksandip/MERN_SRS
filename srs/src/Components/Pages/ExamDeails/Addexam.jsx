import React from "react";

function Addexam() {
  return (
    <>
      <div className="row">
        <div
          className="Section"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div className="col-xl-6 col-lg-6 col-12 mt-2 form-group">
            <label> Exam Name </label>
            <input
              type="text"
              placeholder="Enter the exam name"
              className="form-control"
            />
          </div>
          <div className="col-xl-6 col-lg-6 col-12 mt-2 form-group">
            <label> Academic Year </label>
            <input type="text" className="form-control" />
          </div>

          <button
            type="submit"
            className="btn btn-primary submit ml"
            style={{ marginRight: "90%" }}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
}

export default Addexam;
