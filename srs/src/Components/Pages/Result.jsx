import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

function Result() {
  const [examNames, setExamNames] = useState([]);
  const [selectedExamName, setSelectedExamName] = useState("");
  const [classNames, setClassNames] = useState([]);
  const [selectedClassName, setselectedClassName] = useState("");
  const [obtainedMarksData, setObtainedMarksData] = useState([]);
  const [subjectNames, setSubjectNames] = useState([]);
  const [showGradePoints, setShowGradePoints] = useState(true); // New state
  const ref = React.createRef();
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    const fetchExamNames = async () => {
      try {
        const response = await axios.get("/api/exams");
        setExamNames(response.data || []);
        const ClassResponse = await axios.get("/classdetail");
        setClassNames(ClassResponse.data || []);
      } catch (error) {
        console.error("Error fetching exam names", error);
      }
    };

    const fetchObtainedMarksData = async () => {
      try {
        const response = await axios.get("/obtainedmarks");

        const filteredData = response.data.filter(
          (examResult) =>
            examResult.examType === selectedExamName &&
            examResult.Studentclass === selectedClassName
        );

        const allSubjectNames = filteredData.reduce((subjects, examResult) => {
          examResult.students.forEach((student) => {
            student.subjects.forEach((subject) => {
              if (!subjects.includes(subject.subject)) {
                subjects.push(subject.subject);
              }
            });
          });
          return subjects;
        }, []);

        setSubjectNames(allSubjectNames);

        // Calculate the total marks and rank for each student
        const studentsWithTotalAndRank = filteredData.flatMap((examResult) => {
          return examResult.students.map((student) => {
            const totalMarks = student.subjects.reduce((total, subject) => {
              const obtainedMarks = subject.obtainedMarks;
              const subjectMarks = obtainedMarks.match(/(\d+)/g);

              return (
                total +
                (subjectMarks
                  ? subjectMarks.reduce(
                      (sum, mark) => sum + parseInt(mark, 10),
                      0
                    )
                  : 0)
              );
            }, 0);

            const gradePointsArray = student.subjects.map((subject) => {
              return calculateSubjectGradePoints(
                subject.obtainedMarks,
                subject.fullMarks
              );
            });

            const totalGradePoints =
              gradePointsArray.length > 0
                ? (
                    gradePointsArray.reduce(
                      (sum, gradePoint) => sum + gradePoint,
                      0
                    ) / gradePointsArray.length
                  ).toFixed(2)
                : 0;

            return {
              ...student,
              totalMarks,
              totalGradePoints,
            };
          });
        });

        // Sort students based on total marks in descending order
        const sortedStudents = studentsWithTotalAndRank.sort(
          (a, b) => b.totalMarks - a.totalMarks
        );

        // Assign rank to each student
        const studentsWithRank = sortedStudents.map((student, index) => ({
          ...student,
          rank: index + 1,
        }));

        setObtainedMarksData(studentsWithRank || []);
      } catch (error) {
        console.error("Error fetching obtained marks data", error);
      }
    };

    fetchExamNames();
    fetchObtainedMarksData();
  }, [selectedExamName, selectedClassName]);

  const calculateSubjectGradePoints = (obtainedMarks, fullMarks) => {
    const percentage = (obtainedMarks / fullMarks) * 100;

    if (percentage >= 90) {
      return 4.0;
    } else if (percentage >= 80) {
      return 3.6;
    } else if (percentage >= 70) {
      return 3.2;
    } else if (percentage >= 60) {
      return 2.8;
    } else if (percentage >= 50) {
      return 2.4;
    } else if (percentage >= 40) {
      return 2.0;
    } else if (percentage >= 35) {
      return 1.6;
    } else {
      return 0.0; // Default grade point for marks below 40% of full marks
    }
  };

  const handleGenerateGradeSheet = async () => {
    try {
      setPdfLoading(true);
      let gpa = "";
      const logoPath = "/Images/logo.png";
      const logoWidth = 30; // Set your desired logo width
      const logoHeight = 30;

      const GradeSheet = "/Images/gradesheet.png";
      const GradeWidth = 130; // Set your desired logo width
      const GradeHeight = 90;
      // Create a new jsPDF instance
      const doc = new jsPDF();
      // Iterate over each student and add their details to the PDF
      for (let index = 0; index < obtainedMarksData.length; index++) {
        const student = obtainedMarksData[index];

        // Add page for each student
        if (index > 0) {
          doc.addPage();
        }
        const finalGrade = FinalGPA(gpa);
        // Set font size and add header
        const headingFontSize = 40; // Set your desired font size
        const headingFontStyle = "bold"; // Set the font style to bold
        const headingMargin = 7;
        const borderMargin = 5; // Set your desired margin inside the border

        // Draw a border around the page with a 5-pixel margin inside
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const borderWidth = 2; // Set your desired border width
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
        doc.text(` ${selectedExamName}`, 70, 27);

        doc.setFontSize(16);
        doc.setFont("normal");

        // Set the fill color for the "PROGRESS REPORT" row
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
        doc.text(`Student Name: ${student.name}`, nameX, nameY);
        doc.text(`Roll Number: ${student.rollNumber}`, nameA, nameB);
        doc.text(`Class: ${selectedClassName}`, nameC, nameD);
        // Add table with subjects, obtained marks, etc.
        doc.autoTable({
          startY: 80,
          head: [["S.N", "Subject", "Grade Points", "GPA"]],
          body: student.subjects.map((subject, sn) => {
            const gradePoints = showGradePoints
              ? parseFloat(
                  calculateSubjectGradePoints(
                    subject.obtainedMarks,
                    subject.fullMarks
                  ).toFixed(2)
                )
              : null; // Assuming a default value of 0 if showGradePoints is false

            const gpa = calculateGPA(gradePoints);
            const finalGrade = FinalGPA(parseFloat(gpa));
            // Add a function to calculate GPA
            return [sn + 1, subject.subject, gradePoints, gpa, finalGrade];
          }),
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

        const rectA = 5; // Adjust the X-coordinate as needed
        const rectB = doc.autoTable.previous.finalY + 10;
        const rectlength = 200; // Adjust the width as needed
        const rectbreadth = 15;
        const nameE = rectA + 5;
        const nameF = rectB + 10;

        const nameG = rectA + 170;
        const nameH = rectB + 10;
        const nameI = rectA + 100;
        doc.setDrawColor(0, 0, 0); // Set the border color to black
        doc.setFillColor(255, 255, 255); // Set the fill color to white
        doc.rect(rectA, rectB, rectlength, rectbreadth, "FD");
        // Add total marks, total grade points, rank, remarks, etc.

        doc.text(
          `Grade Point Average (GPA): ${student.totalGradePoints}`,
          nameE,
          nameF
        );
        doc.text(`Rank: ${student.rank}`, nameG, nameH);
        doc.text(
          `Final Grade: ${FinalGPA(student.totalGradePoints)}`,
          nameI,
          nameH
        );
        doc.addImage(
          GradeSheet,
          "PNG",
          6,
          doc.autoTable.previous.finalY + 33,
          GradeWidth,
          GradeHeight
        );

        doc.text(
          `Remarks: ${
            student.subjects.every(
              (subject) =>
                parseInt(subject.obtainedMarks, 10) >= subject.passMarks
            )
              ? "Passed"
              : "Failed"
          }`,
          155,
          doc.autoTable.previous.finalY + 33
        );
        doc.text(`...........................`, 10, 270);
        doc.text(`........................`, 97, 270);
        doc.text(`........................`, 163, 270);
        doc.text(`Class Teacher`, 12, 275);
        doc.text(`Principal`, 102, 275);
        doc.text(`Guardian`, 167, 275);
      }

      // Get the blob URL of the PDF
      const blob = doc.output("blob");
      const blobUrl = URL.createObjectURL(blob);

      // Show the preview in a new window
      const previewWindow = window.open(blobUrl, "_blank");

      // Optionally, you can set a timeout and close the preview window after a few seconds
      setPdfLoading(false);
    } catch (error) {
      console.error("Error generating grade sheet:", error);
      setPdfLoading(false);
    }
  };

  function calculateGPA(gradePoints) {
    if (gradePoints >= 3.6) {
      return "A+";
    } else if (gradePoints >= 3.2) {
      return "A";
    } else if (gradePoints >= 2.8) {
      return "B+";
    } else if (gradePoints >= 2.4) {
      return "B";
    } else if (gradePoints >= 2.0) {
      return "C+";
    } else if (gradePoints >= 1.6) {
      return "C";
    } else if (gradePoints >= 1.2) {
      return "D+";
    } else {
      return "NG";
    }
  }
  function FinalGPA(gpa) {
    if (gpa >= 3.6) {
      return "A+";
    } else if (gpa >= 3.2) {
      return "A";
    } else if (gpa >= 2.8) {
      return "B+";
    } else if (gpa >= 2.4) {
      return "B";
    } else if (gpa >= 2.0) {
      return "C+";
    } else if (gpa >= 1.6) {
      return "C";
    } else if (gpa >= 1.2) {
      return "D+";
    } else {
      return "NG";
    }
  }

  const handlePrint = () => {
    try {
      setPdfLoading(true);

      // Check if the print window is already open
      const printWindow = window.open("", "_blank");

      // Write the content to the print window
      printWindow.document.write(
        `<html><head>
          <style>
            @media print {
              body { margin: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 3px solid #ddd; padding: 8px; }
              h5 { margin-bottom: 50px; }
              @page { size: landscape; margin: 20px; }
            }
          </style>
        </head><body>`
      );
      printWindow.document.write(
        `<h5>Class: ${selectedClassName} | Exam: ${selectedExamName}</h5>`
      );
      printWindow.document.write(ref.current.innerHTML);
      printWindow.document.write("</body></html>");

      // Call print on the print window
      printWindow.print();
      printWindow.onafterprint = () => {
        // Close the window after printing
        printWindow.close();
        setPdfLoading(false);
      };
    } catch (error) {
      console.error("Error opening print window:", error);
      setPdfLoading(false);
    }
  };

  const handleExamNameChange = (event) => {
    setSelectedExamName(event.target.value);
  };

  const handleClassNameChange = (event) => {
    setselectedClassName(event.target.value);
  };

  const handleToggleGradePoints = () => {
    setShowGradePoints((prev) => !prev);
  };

  const tableStyles = {
    display: "none",
  };

  const printStyles = {
    display: "block",
  };

  return (
    <div>
      <>
        <h6>View Ledgers</h6>
        <div className="row">
          <div className="col-md-6">
            <label>
              <select value={selectedExamName} onChange={handleExamNameChange}>
                <option value="">Select an exam</option>
                {examNames.map((exam) => (
                  <option key={exam._id} value={exam.examName}>
                    {exam.examName}
                  </option>
                ))}
              </select>
            </label>
            <br />
          </div>
          <div className="col-md-6">
            <label>
              <select
                value={selectedClassName}
                onChange={handleClassNameChange}
              >
                <option value="">Select Class</option>
                {classNames.map((className) => (
                  <option key={className._id} value={className.classNameS}>
                    {className.classNameS}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <br />
        <br />

        <div className="row">
          <div className="col-md-3">
            <h5> class: {selectedClassName}</h5>
          </div>

          <div className="col-md-4">
            <h5>Exam:{selectedExamName}</h5>
          </div>
          <button
            className="col-md-2 mb-2 btn btn-primary"
            onClick={handleToggleGradePoints}
          >
            {showGradePoints ? "Hide Grade Points" : "Show Grade Points"}
          </button>
          <div className="col-md-1"></div>
          <button
            className="col-md-2 mb-2 btn btn-primary "
            onClick={handleGenerateGradeSheet}
          >
            Generate GradeSheet
          </button>
        </div>
      </>
      <div
        className="table-responsive"
        ref={ref}
        style={pdfLoading ? tableStyles : printStyles}
      >
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Roll Number</th>
              {subjectNames.map((subject) => (
                <React.Fragment key={subject}>
                  <th>{subject}</th>
                  {showGradePoints && <th>Grade Points</th>}
                </React.Fragment>
              ))}
              <th>Total Obtained Marks</th>
              <th>Total Grade Points</th>
              <th>Rank</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {obtainedMarksData.map((student) => (
              <React.Fragment key={student.rollNumber}>
                <tr>
                  <td>{student.name}</td>
                  <td>{student.rollNumber}</td>
                  {subjectNames.map((subject) => {
                    const subjectData = student.subjects.find(
                      (s) => s.subject === subject
                    );
                    const isFailed =
                      subjectData &&
                      (subjectData.obtainedMarks === undefined ||
                        parseInt(subjectData.obtainedMarks, 10) <
                          subjectData.passMarks);

                    return (
                      <React.Fragment key={subject}>
                        <td
                          style={{
                            backgroundColor: isFailed ? "#f2f2f2" : "",
                            fontWeight: isFailed ? "bold" : "normal",
                          }}
                        >
                          {subjectData && subjectData.obtainedMarks
                            ? subjectData.obtainedMarks
                            : ""}
                        </td>
                        {showGradePoints && (
                          <td>
                            {subjectData
                              ? calculateSubjectGradePoints(
                                  subjectData.obtainedMarks,
                                  subjectData.fullMarks
                                ).toFixed(2)
                              : ""}
                          </td>
                        )}
                      </React.Fragment>
                    );
                  })}
                  <td>{student.totalMarks}</td>
                  <td>{student.totalGradePoints}</td>
                  <td>{student.rank}</td>
                  <td>
                    {student.subjects.every(
                      (subject) =>
                        parseInt(subject.obtainedMarks, 10) >= subject.passMarks
                    )
                      ? "Passed"
                      : "Failed"}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className="btn btn-primary"
        onClick={handlePrint}
        disabled={pdfLoading}
      >
        {pdfLoading ? "Generating PDF..." : "Print"}
      </button>
    </div>
  );
}

export default Result;
