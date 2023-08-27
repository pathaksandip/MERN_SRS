import React from "react";
import { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import Addexam from "./ExamDeails/Addexam";
import Examlist from "./ExamDeails/Examlist";
import AddexamDetails from "./AddexamDetails";
function Dexam() {
  const [key, setKey] = useState("addExam");
  return (
    <>
      <h1 style={{ margin: "3%" }}>Add Exam</h1>
      <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
        <Tab eventKey="addExam" title="Add Exam" >
          <Addexam />
        </Tab>
        <Tab eventKey="examList" title="Exam List">
          <Examlist />
        </Tab>
        <Tab eventKey="examDetails" title="Add Exam Details">
          <AddexamDetails />
        </Tab>
      </Tabs>
    </>
  );
}

export default Dexam;
