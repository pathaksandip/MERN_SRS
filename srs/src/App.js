import Home from "./Components/Home";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import Student from "./Components/Student";
import Admin from "./Components/Admin";
import AboutUs from "./Components/AboutUs";
import Teacher from "./Components/Teacher";
import Dashboard from "./Components/Pages/Dashboard";
import Dhome from "./Components/Pages/Dhome";
import Ateacher from "./Components/Ateacher";
import Dstudent from "./Components/Pages/Dstudent";
import Dclass from "./Components/Pages/Dclass";
import Dsubject from "./Components/Pages/Dsubject";
import Dexam from "./Components/Pages/Dexam";
import Result from "./Components/Pages/Result";
import Dteacher from "./Components/Dteacher";
import Studentdetails from "./Components/Pages/Studentdetails";
import Addexam from "./Components/Pages/ExamDeails/Addexam";
import Examlist from "./Components/Pages/ExamDeails/Examlist";
import AddexamDetails from "./Components/Pages/AddexamDetails";
axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/student" element={<Student />} />
          <Route path="/teacher" element={<Teacher />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dhome" element={<Dhome />} />
          <Route path="/ateacher" element={<Ateacher />} />
          <Route path="/dstudent" element={<Dstudent />} />
          <Route path="/dclass" element={<Dclass />} />
          <Route path="/dsubject" element={<Dsubject />} />
          <Route path="/dexam" element={<Dexam />} />
          <Route path="/dresult" element={<Result />} />
          <Route path="/dteacher" element={<Dteacher />} />
          <Route path="/studentdetails" element={<Studentdetails />} />
          <Route path="/addexam" element={<Addexam />} />
          <Route path="/examlist" element={<Examlist />} />
          <Route path="/addexamdetails" element={<AddexamDetails />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
