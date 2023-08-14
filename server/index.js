const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const StudentSchema = require("./Schema/studentschema");
const ClassSchema = require("./Schema/studentclassschema");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json()); // Add this middleware to parse JSON request body

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
//adminschema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("admin", userSchema);

app.post("/loginadmin", async (req, res) => {
  const { username, password } = req.body;
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
    console.log(username, password);
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
    console.log(username, password);
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
const StudentClassDetails = mongoose.model("studentclassdetails", ClassSchema);
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

// Start the server
app.listen(4000, () => {
  console.log("Server started on port 4000");
});
