const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// --- In-memory storage ---
let students = [];
let teachers = [];
let attendance = [];
let grades = [];

// --- Students Routes ---
app.get("/students", (req, res) => {
  res.json(students);
});

app.post("/students", (req, res) => {
  const { name, grade, parent } = req.body;
  const id = students.length + 1;
  const student = { id, name, grade, parent };
  students.push(student);
  res.json(student);
});

app.delete("/students/:id", (req, res) => {
  const id = parseInt(req.params.id);
  students = students.filter(s => s.id !== id);
  res.json({ success: true });
});

// --- Teachers Routes ---
app.get("/teachers", (req, res) => {
  res.json(teachers);
});

app.post("/teachers", (req, res) => {
  const { name, subject } = req.body;
  const id = teachers.length + 1;
  const teacher = { id, name, subject };
  teachers.push(teacher);
  res.json(teacher);
});

app.delete("/teachers/:id", (req, res) => {
  const id = parseInt(req.params.id);
  teachers = teachers.filter(t => t.id !== id);
  res.json({ success: true });
});

// --- Attendance Routes ---
app.get("/attendance", (req, res) => {
  res.json(attendance);
});

app.post("/attendance", (req, res) => {
  const { studentId, date, status } = req.body;
  const id = attendance.length + 1;
  const record = { id, studentId, date, status };
  attendance.push(record);
  res.json(record);
});

// --- Grades Routes ---
app.get("/grades", (req, res) => {
  res.json(grades);
});

app.post("/grades", (req, res) => {
  const { studentId, subject, grade } = req.body;
  const id = grades.length + 1;
  const record = { id, studentId, subject, grade };
  grades.push(record);
  res.json(record);
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
