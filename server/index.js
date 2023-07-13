const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const StudentSchema = require("./Schema/studentschema");

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
    console.log(response);
    res.status(200).json({ message: "Teacher created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

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

app.get("/getteacherdetail", async (req, res) => {
  try {
    const Teachers = await Teacher.find();
    res.status(200).json(Teachers);
    console.log(Teachers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

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
    console.log(response);
    res.status(200).json({ message: "Student created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

// Start the server
app.listen(4000, () => {
  console.log("Server started on port 4000");
});
