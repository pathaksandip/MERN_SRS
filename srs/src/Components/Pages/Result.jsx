import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactToPdf from "react-to-pdf";

function Result() {
  const [examNames, setExamNames] = useState([]);
  const [selectedExamName, setSelectedExamName] = useState("");
  const [classNames, setClassNames] = useState([]);
  const [selectedClassName, setselectedClassName] = useState("");
  const [obtainedMarksData, setObtainedMarksData] = useState([]);
  const [subjectNames, setSubjectNames] = useState([]);
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
              const subjectMarks = obtainedMarks.match(/.{2}/g);
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

            return {
              ...student,
              totalMarks,
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
          <div className="col-md-6">
            <h5> class: {selectedClassName}</h5>
          </div>
          <div className="col-md-6">
            <h5>Exam:{selectedExamName}</h5>
          </div>
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
                <th key={subject}>{subject}</th>
              ))}
              <th>Total Obtained Marks</th>
              <th>Rank</th> {/* New column for Rank */}
              <th> Remarks</th>
            </tr>
          </thead>
          <tbody>
            {obtainedMarksData.map((student) => (
              <tr key={student.rollNumber}>
                <td>{student.name}</td>
                <td>{student.rollNumber}</td>
                {subjectNames.map((subject) => {
                  const subjectData = student.subjects.find(
                    (s) => s.subject === subject
                  );
                  const isFailed =
                    subjectData &&
                    subjectData.obtainedMarks < subjectData.passMarks;
                  return (
                    <td
                      key={subject}
                      style={{
                        backgroundColor: isFailed ? "#f2f2f2" : "",
                        fontWeight: isFailed ? "bold" : "normal",
                      }}
                    >
                      {subjectData && subjectData.obtainedMarks
                        ? subjectData.obtainedMarks
                        : ""}
                    </td>
                  );
                })}
                <td>{student.totalMarks}</td>
                <td>{student.rank}</td>
                <td>
                  {student.subjects.every(
                    (subject) => subject.obtainedMarks >= subject.passMarks
                  )
                    ? "Passed"
                    : "Failed"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={handlePrint} disabled={pdfLoading}>
        {pdfLoading ? "Generating PDF..." : "Print/Download Table"}
      </button>
    </div>
  );
}

export default Result;
