import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import { Dropdown } from "react-bootstrap";

function Student() {
  const [examNames, setExamNames] = useState([]);
  const [classNames, setClassNames] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [admissionID, setAdmissionID] = useState("");
  const [totalGradePointsResult, setTotalGradePointsResult] = useState(null);
  const [remarksResult, setRemarksResult] = useState("");
  const [totalGradePointsGradesheet, setTotalGradePointsGradesheet] =
    useState(null);
  const [remarksGradesheet, setRemarksGradesheet] = useState("");
  const [error, setError] = useState(null);

  const resetState = () => {
    setTotalGradePointsResult(null);
    setRemarksResult(null);
    setTotalGradePointsGradesheet(null);
    setRemarksGradesheet(null);
  };
  const generatePDF = (
    totalGradePoints,
    remarks,
    studentName,
    rollNumber,
    className,
    subjects,
    selectedExam
  ) => {
    console.log("generatePDF called");
    const doc = new jsPDF();

    const logoPath = "/Images/logo.png";
    const logoWidth = 30; // Set your desired logo width
    const logoHeight = 30;
    const headingFontSize = 40; // Set your desired font size
    const headingFontStyle = "bold"; // Set the font style to bold
    const headingMargin = 7;
    const borderMargin = 5; // Set your desired margin inside the border

    // Draw a border around the page with a 5-pixel margin inside
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = 210;
    const borderWidth = 1; // Set your desired border width
    doc.setLineWidth(borderWidth);
    doc.rect(
      borderMargin,
      borderMargin,
      pageWidth - 2 * borderMargin,
      pageHeight - 2 * borderMargin
    );

    const whitishDarkColor = [100, 100, 100];
    doc.setDrawColor(
      whitishDarkColor[0],
      whitishDarkColor[1],
      whitishDarkColor[2]
    );
    doc.setTextColor(
      whitishDarkColor[0],
      whitishDarkColor[1],
      whitishDarkColor[2]
    );

    doc.setFontSize(headingFontSize);
    doc.setFont(headingFontStyle);
    // Center the heading "School Result System"
    const textWidth =
      (doc.getStringUnitWidth("School Result System") * headingFontSize) /
      doc.internal.scaleFactor;
    const xOffset = (doc.internal.pageSize.width - textWidth) / 2;
    doc.addImage(logoPath, "PNG", 9, 4, logoWidth, logoHeight);

    doc.text("School Result System", xOffset, 10 + headingMargin);

    // Set font size and style for the rest of the document
    const selectedExamFontSize = 20;
    const selectedExamFontStyle = "bold";
    doc.setFontSize(selectedExamFontSize);
    doc.setFont(selectedExamFontStyle);
    doc.text(` ${selectedExam}`, 70, 27);

    doc.setFontSize(16);
    doc.setFont("normal");

    const progressReportBackgroundColor = [0, 0, 0]; // Black color
    doc.setFillColor(
      progressReportBackgroundColor[0],
      progressReportBackgroundColor[1],
      progressReportBackgroundColor[2]
    );

    const progressReportWidth = 200; // Set your desired width
    doc.rect(5, 31, progressReportWidth, 10, "F");

    // Set text color for "PROGRESS REPORT"
    const progressReportTextColor = [255, 255, 255]; // White color
    doc.setTextColor(
      progressReportTextColor[0],
      progressReportTextColor[1],
      progressReportTextColor[2]
    );

    // Add "PROGRESS REPORT" text
    doc.text(`PROGRESS REPORT`, 80, 37);
    doc.setFontSize(16);
    doc.setFont("normal");
    doc.setTextColor(0, 0, 0);
    //issueddate
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

    // Add "Issued Date"
    doc.text(`Issued Date: ${formattedDate}`, 140, 46);
    const rectX = 5; // Adjust the X-coordinate as needed
    const rectY = 48; // Adjust the Y-coordinate as needed
    const rectWidth = 200; // Adjust the width as needed
    const rectHeight = 25; // Adjust the height as needed

    doc.setDrawColor(0, 0, 0); // Set the border color to black
    doc.setFillColor(255, 255, 255); // Set the fill color to white
    doc.rect(rectX, rectY, rectWidth, rectHeight, "FD");

    const nameX = rectX + 5; // Adjust the X-coordinate to position the name inside the rectangle
    const nameY = rectY + 10;

    const nameA = rectX + 150; // Adjust the X-coordinate to position the name inside the rectangle
    const nameB = rectY + 10;
    const nameC = rectX + 5;
    const nameD = rectY + 20;
    doc.text(`Student Name: ${studentName}`, nameX, nameY);
    doc.text(`Roll Number: ${rollNumber}`, nameA, nameB);
    doc.text(`Class: ${className}`, nameC, nameD);

    doc.autoTable({
      startY: 80,
      head: [["S.N", "Subject", "Grade Points", "GPA"]],
      body: subjects.map((subject, index) => [
        index + 1,
        subject.subjectName,
        subject.gradePoints,
        subject.grade,
      ]),
      styles: {
        cellPadding: 2,
        fontSize: 12,
        lineColor: [0, 0, 0], // Border color (black)
        lineWidth: 0.5, // Border width
        textColor: [0, 0, 0], // Text color (black)
      },
      headStyles: {
        fillColor: [200, 200, 200], // Header background color
        textColor: [0, 0, 0], // Header text color
      },
    });

    // Add the total GPA and remarks
    doc.text(
      `Total GPA: ${totalGradePoints}`,
      20,
      doc.autoTable.previous.finalY + 10
    );
    doc.text(`Remarks: ${remarks}`, 20, doc.autoTable.previous.finalY + 20);

    // Output the PDF to a new window
    doc.output("dataurlnewwindow");
  };

  const viewResult = async (e) => {
    e.preventDefault();
    console.log("View Result clicked");
    try {
      const response = await axios.post("/result/obtained", {
        admissionID,
        selectedExam,
        selectedClass,
      });

      if (response.data && response.data.student) {
        const student = response.data.student;
        setTotalGradePointsResult(student.totalGradePoints);
        setRemarksResult(student.remarks);
        setError(null);
      } else {
        resetState();

        if (response.status === 404) {
          setError("Result Not found");
        } else {
          setError("Internal Server Error");
        }
      }
    } catch (error) {
      resetState();

      if (error.response && error.response.status === 400) {
        setError("Result Not found");
      } else {
        setError(error.message || "Internal Server Error");
      }

      setTimeout(() => {
        setError(null);
      }, 5000);
    }

    setTimeout(resetState, 10000);
  };

  const viewGradesheet = async () => {
    try {
      const response = await axios.post("/result/gradesheet", {
        admissionID,
        selectedExam,
        selectedClass,
      });

      if (response.data && response.data.student) {
        const student = response.data.student;
        console.log("Student Object:", student);

        // Check if subjects array is present and log its length
        if (student.subjects) {
          console.log("Number of Subjects:", student.subjects.length);

          // Log subject names to the console
          console.log("Subject Names:");
          student.subjects.forEach((subject) => {
            console.log("name for subject", subject.subjectName);
          });
        } else {
          console.log("No subjects found in the student object.");
        }

        setTotalGradePointsGradesheet(student.totalGradePoints);
        setRemarksGradesheet(student.remarks);

        // Generate PDF for gradesheet
        generatePDF(
          student.totalGradePoints,
          student.remarks,
          student.name,
          student.rollNumber,
          selectedClass,
          student.subjects,
          selectedExam,
          student.grade
        );
      }
    } catch (error) {
      // Handle errors while fetching gradesheet data
    }

    setTimeout(resetState, 10000);
  };

  useEffect(() => {
    // Fetch exam names and class details when the component mounts
    const fetchExamNames = async () => {
      try {
        const response = await axios.get("/api/exams");
        setExamNames(response.data || []);
        const classResponse = await axios.get("/classdetail");
        setClassNames(classResponse.data || []);
      } catch (error) {
        console.error("Error fetching exam names", error);
      }
    };

    fetchExamNames();
  }, []);

  return (
    <div>
      <div className="container mt-2">
        <div className="row">
          <div className="col-md-6 leftside">
            <p id="tname">MBSS</p>
            <Link to={"/"}>
              <img src={"/images/logo.png"} className="logo" alt="logo" />
            </Link>
            <h2 className="quote">
              Transforming Education: Effortlessly Accurate Online School
              Results!
            </h2>
          </div>
          <div className="col-md-6 rightside">
            <form action="/loginadmin" method="post" className="login">
              <h1 className="row justify-content-center">
                School Result System
              </h1>
              <h5 className="row justify-content-center"> Student Panel</h5>
              <div className="mb-3">
                <label htmlFor="SelectExam" className="form-label">
                  Select Exam
                </label>
                <select
                  className="form-control"
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                >
                  <option value="">Select an exam</option>
                  {examNames.map((examName) => (
                    <option key={examName._id} value={examName.examName}>
                      {examName.examName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="Class" className="form-label">
                  Class
                </label>
                <select
                  className="form-control"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="">Select a class</option>
                  {classNames.map((className) => (
                    <option key={className._id} value={className.classNameS}>
                      {className.classNameS}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="Student ID" className="form-label">
                  Student ID
                </label>
                <input
                  value={admissionID}
                  onChange={(e) => setAdmissionID(e.target.value)}
                  type="number"
                  className="form-control"
                  placeholder="Enter Your ID"
                />
              </div>
              <div className="text-center d-flex flex-column">
                <Dropdown>
                  <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    View
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={viewResult}>
                      View Result
                    </Dropdown.Item>
                    <Dropdown.Item onClick={viewGradesheet}>
                      View Gradesheet
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <p className="text-center text-danger">{error}</p>
              </div>
              {totalGradePointsResult !== null && remarksResult && (
                <div>
                  <p>
                    You have Obtained {totalGradePointsResult} GPA and You are
                    {remarksResult}
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Student;
