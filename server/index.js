const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const StudentSchema = require("./Schema/studentschema");
const StudentClassDetails = require("./Schema/studentclassschema");
const SubjectDetails = require("./Schema/subjectdetailschema");
const Message = require("./Schema/Messageschema");
const Marks = require("./Schema/Marks");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
const Examdetails = require("./Schema/Examdetails");
const ExamResult = require("./Schema/ExamResults");

// Enable CORS
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://pathaksandip321:i73bswYVGQRxLQLz@cluster0.drpkplt.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Start the server
app.listen(4000, () => {
  console.log("Server started on port 4000");
});

//adminschema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("admin", userSchema);

app.post("/loginadmin", async (req, res) => {
  const { username } = req.body;
  try {
    const response = await User.findOne({
      username: username,
    });
    console.log(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
});
//adminregister
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const response = await User.create({ username, password });
    console.log(response);
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
});
//adminlogin
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      username,
    });

    if (user) {
      // User found, check password
      if (user.password === password) {
        res.status(200).json({ message: "Login successful" });
      } else {
        res.status(401).json({ message: "Invalid password" });
      }
    } else {
      // User not found
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occurred" });
  }
});
//teacherschema
const TeacherSchema = new mongoose.Schema({
  tName: String,
  temail: String,
  tphone: Number,
  taddress: String,
  tgender: String,
  tusername: String,
  tsubject: String,
  tdob: Date,
  tpassword: String,
});
//teacherdetails
const Teacher = mongoose.model("teacherdetail", TeacherSchema);

app.post("/teacherdetail", async (req, res) => {
  try {
    const {
      tName,
      temail,
      tphone,
      taddress,
      tgender,
      tusername,
      tsubject,
      tdob,
      tpassword,
    } = req.body;
    const response = await Teacher.create({
      tName,
      temail,
      tphone,
      taddress,
      tgender,
      tusername,
      tsubject,
      tdob,
      tpassword,
    });
    res.status(200).json({ message: "Teacher created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
});
//loginiteacherfordashboard
app.post("/login/teacher", async (req, res) => {
  try {
    const { username, password } = req.body;
    const foundTeacher = await Teacher.findOne({
      tusername: username,
      tpassword: password,
    });
    if (foundTeacher) {
      // User found, check password
      if (foundTeacher.tpassword === password) {
        res.status(200).json({ message: "Login successful" });
      } else {
        res.status(401).json({ message: "Invalid password" });
      }
    } else {
      // User not found
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
});
//getteacherdetails
app.get("/getteacherdetail", async (req, res) => {
  try {
    const Teachers = await Teacher.find();
    res.status(200).json(Teachers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
});
//deleteteacher
app.delete("/removeteacher/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Teacher.findByIdAndDelete(id);
    res.status(200).json({ message: "Teacher removed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
});
//editteacher
app.put("/updateteacher/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      tName,
      temail,
      tphone,
      taddress,
      tgender,
      tusername,
      tsubject,
      tdob,
      tpassword,
    } = req.body;

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      id,
      {
        tName,
        temail,
        tphone,
        taddress,
        tgender,
        tusername,
        tsubject,
        tdob,
        tpassword,
      },
      { new: true }
    );
    res.json(updatedTeacher);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update teacher details" });
  }
});
//deatails
const Student = mongoose.model("studentdetails", StudentSchema);

app.post("/studentsdetails", async (req, res) => {
  try {
    const {
      fname,
      lname,
      gender,
      sdob,
      roll,
      email,
      studentclass,
      admissionID,
      phone,
      guardianname,
    } = req.body;
    console.log(fname);
    const response = await Student.create({
      fname,
      lname,
      gender,
      sdob,
      roll,
      email,
      studentclass,
      admissionID,
      phone,
      guardianname,
    });
    res.status(200).json({ message: "Student created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
});
//getstudentdata
app.get("/studentsdetails", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
});
//forfetchingdetailstoselectedclass
app.get("/sstudentsdetails", async (req, res) => {
  try {
    const selectedClass = req.query.class; // Get the class from the query parameter
    const students = await Student.find({ studentclass: selectedClass });
    res.json(students);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

//deletestudent
app.delete("/removestudent/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    res.status(200).json({ message: "Student removed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
});
//updatestudent
app.put("/updatestudent/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fname,
      lname,
      gender,
      sdob,
      roll,
      email,
      studentclass,
      admissionID,
      phone,
      guardianname,
    } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      {
        fname,
        lname,
        gender,
        sdob,
        roll,
        email,
        studentclass,
        admissionID,
        phone,
        guardianname,
      },
      { new: true }
    );
    if (updatedStudent) {
      res.status(200).json(updatedStudent);
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//forstudent'sclass
//postclassdetails
app.post("/classdetail", async (req, res) => {
  try {
    const { classNameS, classNameNumeric } = req.body;
    const response = await StudentClassDetails.create({
      classNameS,
      classNameNumeric,
    });
    res.status(200).json({ message: "Class created successfully" });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error (classNameS is not unique)
      res.status(400).json({ message: "Class name already exists" });
    } else {
      console.log(error);
      res.status(500).json({ message: "An error occurred" });
    }
  }
});

//getclassdetails
app.get("/classdetail", async (req, res) => {
  try {
    const classDetails = await StudentClassDetails.find();

    if (!classDetails) {
      return res.status(404).json({ message: "Class details not found" });
    }

    res.status(200).json(classDetails);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
});
//deleteclass
app.delete("/classdetail/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await StudentClassDetails.findByIdAndDelete(id);
    res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
});
//postsubjectdetails
app.post("/subjectdetail", async (req, res) => {
  try {
    const { SubjectName, SubjectCode, SubjectCreditHour } = req.body;
    const response = await SubjectDetails.create({
      SubjectName,
      SubjectCode,
      SubjectCreditHour,
    });
    res.status(200).json({ message: "Subject created successfully" });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error (classNameS is not unique)
      res.status(400).json({ message: "Subjectname already exists" });
    } else {
      console.log(error);
      res.status(500).json({ message: "An error occurred" });
    }
  }
});
//getsubjectdetails
app.get("/subjectdetail", async (req, res) => {
  try {
    const SubjectD = await SubjectDetails.find();

    if (!SubjectD) {
      return res.status(404).json({ message: "Subject details not found" });
    }

    res.status(200).json(SubjectD);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
});
//deletesubjectdetails

app.delete("/subjectdetail/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await SubjectDetails.findByIdAndDelete(id);
    res.status(200).json({ message: "Subjectdetail deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured" });
  }
});
//examdetails
app.post("/api/addexam", async (req, res) => {
  try {
    const { examName, academicYear } = req.body;
    const newExam = new Examdetails({
      examName,
      academicYear,
    });
    const savedExam = await newExam.save();
    res.status(201).json(savedExam);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});
//getexam
app.get("/api/exams", async (req, res) => {
  try {
    const exams = await Examdetails.find();
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});
//formessage
app.post("/message", async (req, res) => {
  try {
    const { messages, email } = req.body;
    const response = await Message.create({
      messages,
      email,
    });
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

app.put("/classdetail/:id/assignsubjects", async (req, res) => {
  try {
    const { id } = req.params; // Get the class ID from the URL parameters
    const { assignedSubjects } = req.body; // Get the assigned subjects from the request body

    // Find the class by ID
    const classDetails = await StudentClassDetails.findById(id);

    if (classDetails) {
      // Update the assignedSubjects field for the class
      classDetails.assignedSubjects = assignedSubjects;

      // Save the updated class document
      const updatedClass = await classDetails.save();

      res.status(200).json({ message: "Subjects assigned successfully" });
    } else {
      res.status(404).json({ message: "Class not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

app.get("/classdetail/:id/assignsubjects", async (req, res) => {
  try {
    const { id } = req.params; // Get the class ID from the URL parameters

    // Assuming you have a Mongoose model named StudentClassDetails
    const classDetails = await StudentClassDetails.findById(id).populate(
      "assignedSubjects"
    ); // Populate the assignedSubjects with actual subject details

    if (classDetails) {
      res.status(200).json(classDetails.assignedSubjects);
    } else {
      res.status(404).json({ message: "Class not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

//examdelete

app.delete("/api/exam/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Examdetails.findByIdAndDelete(id);
    res.status(200).json({ message: "Exam deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured" });
  }
});
//storefull marks
app.post("/api/save-marks", (req, res) => {
  const {
    selectedExam,
    examName,
    selectedClass,
    subjectMarks,
    selectedClassName,
  } = req.body;

  const newMarks = new Marks({
    selectedExam,
    examName,
    selectedClass,
    selectedClassName,
    subjectMarks,
  });

  newMarks
    .save()
    .then((marks) => {
      res.json({ message: "Marks saved successfully", data: marks });
    })
    .catch((error) => {
      console.error("Error saving marks:", error);
      res.status(500).json({ message: "Internal server error" });
    });
});

app.post("/obtainedmarks", async (req, res) => {
  try {
    const { metadata, ObtainedMarksDetails } = req.body;

    // Ensure ObtainedMarksDetails is an array or wrap it in an array
    if (!Array.isArray(ObtainedMarksDetails)) {
      ObtainedMarksDetails = [ObtainedMarksDetails];
    }

    // Map the data to match the ExamResult schema
    const mappedData = ObtainedMarksDetails.reduce((result, item) => {
      const flatSubjects = item.studentName.subjects.reduce(
        (flattened, subjectArray) => flattened.concat(subjectArray),
        []
      );

      const student = {
        name: item.studentName.name,
        rollNumber: item.studentName.rollNumber,
        admissionId: item.studentName.admissionID,
        subjects: flatSubjects.map((subject) => ({
          subject: subject.subject,
          obtainedMarks: subject.obtainedMarks,
          fullMarks: subject.fullMarks,
          passMarks: subject.passMarks,
        })),
      };

      // Find existing ExamResult entry for the same class and examType
      const existingExamResult = result.find(
        (entry) =>
          entry.examType === metadata.examType &&
          entry.Studentclass === metadata.Studentclass
      );

      if (existingExamResult) {
        // Add student to existing ExamResult
        existingExamResult.students.push(student);
      } else {
        // Create a new ExamResult entry
        result.push({
          examType: metadata.examType,
          Studentclass: metadata.Studentclass,
          students: [student],
        });
      }

      return result;
    }, []);


    const savedData = await ExamResult.insertMany(mappedData);

    res.status(201).json({ message: "Obtained marks data saved successfully" });
  } catch (error) {
    console.error("Error while saving data:", error);
    if (error.errors) {
      console.error("Validation errors:", error.errors);
    }
    res.status(500).json({
      error: "An error occurred while saving the obtained marks data",
    });
  }
});

// for checking the result from the studnet
app.post("/result/obtained", async (req, res) => {
  try {
    const { admissionID, selectedClass, selectedExam } = req.body;
    const resultDoc = await ExamResult.findOne({
      "students.admissionId": admissionID,
      examType: selectedExam,
      Studentclass: selectedClass,
    });

    if (resultDoc) {
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

      const student = resultDoc.students.find(
        (student) =>
          parseInt(student.admissionId, 10) === parseInt(admissionID, 10)
      );

      if (student) {
        const gradePointsArray = await Promise.all(
          student.subjects.map(async (subject) => {
            return calculateSubjectGradePoints(
              subject.obtainedMarks,
              subject.fullMarks
            );
          })
        );

        const totalGradePoints =
          gradePointsArray.length > 0
            ? (
                gradePointsArray.reduce(
                  (sum, gradePoint) => sum + gradePoint,
                  0
                ) / gradePointsArray.length
              ).toFixed(2)
            : 0;

        const remarks =
          student.subjects.every(
            (subject) =>
              parseInt(subject.obtainedMarks, 10) >= subject.passMarks
          ) && totalGradePoints > 0
            ? "Passed"
            : "Failed";


        // Update the student object with total grade points and remarks
        const studentWithTotalGradePoints = {
          ...student.toObject(),
          totalGradePoints,
          remarks,
        };

        // Respond with the updated student object
        res.status(200).json({ student: studentWithTotalGradePoints });
      } else {
        console.log("Student not found");
        res.status(404).json({ error: "Student not found" });
      }
    } else {
      console.log("Result not found");
      res.status(404).json({ error: "Result not found" });
    }
  } catch (error) {
    console.log("ERROR", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/result/gradesheet", async (req, res) => {
  try {
    const { admissionID, selectedClass, selectedExam } = req.body;
    const resultDoc = await ExamResult.findOne({
      "students.admissionId": admissionID,
      examType: selectedExam,
      Studentclass: selectedClass,
    });

    if (resultDoc) {
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
      const calculateGPAFromGradePoints = (gradePoints) => {
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
      };
      const student = resultDoc.students.find(
        (student) =>
          parseInt(student.admissionId, 10) === parseInt(admissionID, 10)
      );

      if (student) {
        const subjectsWithGradePoints = await Promise.all(
          student.subjects.map(async (subject) => {
            const gradePoints = calculateSubjectGradePoints(
              subject.obtainedMarks,
              subject.fullMarks
            );
            const subjectInfo = {
              subjectName: subject.subject,
              gradePoints,
              grade: calculateGPAFromGradePoints(gradePoints),
            };

            return subjectInfo;
          })
        );

        const totalGradePoints =
          subjectsWithGradePoints.length > 0
            ? (
                subjectsWithGradePoints.reduce(
                  (sum, { gradePoints }) => sum + gradePoints,
                  0
                ) / subjectsWithGradePoints.length
              ).toFixed(2)
            : 0;

        const remarks =
          student.subjects.every(
            (subject) =>
              parseInt(subject.obtainedMarks, 10) >= subject.passMarks
          ) && totalGradePoints > 0
            ? "Passed"
            : "Failed";

        // Update the student object with total grade points and remarks
        const studentWithTotalGradePoints = {
          ...student.toObject(),
          totalGradePoints,
          remarks,
          subjects: subjectsWithGradePoints,
        };

        // Respond with the updated student object
        res.status(200).json({ student: studentWithTotalGradePoints });
      } else {
        console.log("Student not found");
        res.status(404).json({ error: "Student not found" });
      }
    } else {
      console.log("Result not found");
      res.status(404).json({ error: "Result not found" });
    }
  } catch (error) {
    console.log("ERROR", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/obtainedmarks", async (req, res) => {
  try {
    // Fetch all data from the ExamResult collection
    const obtainedMarksData = await ExamResult.find({});

    res.status(200).json(obtainedMarksData);
  } catch (error) {
    console.error("Error while fetching obtained marks data:", error);
    res.status(500).json({
      error: "An error occurred while fetching the obtained marks data",
    });
  }
});
//checkwhether seleced exam exists or not for same class
app.get("/api/check-exam-exist", async (req, res) => {
  const { Studentclass, examType } = req.query;

  try {
    // Assuming you have a Marks model (replace with your model name)
    const result = await ExamResult.findOne({ Studentclass, examType }).exec();
    if (result === null) {
      // The selected exam does not exist for this class
      res.status(200).json({ examExists: false });
    } else {
      // The selected exam does not exist for this class
      res.status(404).json({ examExists: false });
    }
  } catch (err) {
    console.error("Error during exam validation check", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
