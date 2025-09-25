const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory data storage
let students = [
  { id: 1, name: "John Doe", grade: "A", parent: "Jane Doe" }
];

let teachers = [
  { id: 1, name: "Mr. Smith", subject: "Math" }
];

let attendance = [
  { id: 1, studentId: 1, studentName: "John Doe", present: true, date: "2025-09-24" }
];

let grades = [
  { id: 1, studentId: 1, grade: "A" }
];

let events = [
  { id: 1, title: "Science Fair", date: "2025-10-05" },
  { id: 2, title: "Sports Day", date: "2025-10-12" },
  { id: 3, title: "Parent-Teacher Meeting", date: "2025-10-20" }
];

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

////////////////////////
// Students routes
////////////////////////
app.get("/students", (req, res) => res.json(students));

app.post("/students", (req, res) => {
  const { name, grade, parent } = req.body;
  if (!name || !grade || !parent) {
    return res.status(400).json({ error: "Name, grade, and parent are required" });
  }
  const id = students.length + 1;
  const newStudent = { id, name: name.trim(), grade: grade.trim(), parent: parent.trim() };
  students.push(newStudent);
  res.json(newStudent);
});

app.delete("/students/:id", (req, res) => {
  const id = parseInt(req.params.id);
  students = students.filter(s => s.id !== id);
  res.json({ success: true });
});

////////////////////////
// Teachers routes
////////////////////////
app.get("/teachers", (req, res) => res.json(teachers));

app.post("/teachers", (req, res) => {
  const { name, subject } = req.body;
  if (!name || !subject) {
    return res.status(400).json({ error: "Name and subject are required" });
  }
  const id = teachers.length + 1;
  const newTeacher = { id, name: name.trim(), subject: subject.trim() };
  teachers.push(newTeacher);
  res.json(newTeacher);
});

app.delete("/teachers/:id", (req, res) => {
  const id = parseInt(req.params.id);
  teachers = teachers.filter(t => t.id !== id);
  res.json({ success: true });
});

////////////////////////
// Attendance routes
////////////////////////
app.get("/attendance", (req, res) => res.json(attendance));

app.post("/attendance", (req, res) => {
  const { student_id, present, date } = req.body;
  if (!student_id || typeof present !== "boolean" || !date) {
    return res.status(400).json({ error: "Missing required fields or wrong data types" });
  }

  const student = students.find(s => s.id === student_id);
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  const id = attendance.length + 1;
  const newRecord = {
    id,
    studentId: student_id,
    studentName: student.name,
    present,
    date
  };

  attendance.push(newRecord);
  res.json(newRecord);
});

app.put("/attendance/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { present, date } = req.body;

  const record = attendance.find(a => a.id === id);
  if (!record) {
    return res.status(404).json({ error: "Attendance record not found" });
  }

  if (present !== undefined) record.present = present;
  if (date) record.date = date;

  res.json(record);
});

////////////////////////
// Grades routes
////////////////////////
app.get("/grades", (req, res) => res.json(grades));

// ✅ Bulk grade submission fix
app.post("/grades", (req, res) => {
  const data = req.body;

  if (!Array.isArray(data)) {
    return res.status(400).json({ error: "Expected an array of { id, grade } objects" });
  }

  const updated = [];

  data.forEach(({ id, grade }) => {
    const student = students.find(s => s.id === id);
    if (student) {
      // update student grade
      student.grade = grade.trim();

      const newGrade = { id: grades.length + 1, studentId: id, grade: grade.trim() };
      grades.push(newGrade);

      updated.push(newGrade);
    }
  });

  res.json({ message: "✅ Grades submitted successfully!", updated });
});

////////////////////////
// Events routes
////////////////////////
app.get("/events", (req, res) => res.json(events));

app.post("/events", (req, res) => {
  const { title, date } = req.body;
  if (!title || !date) return res.status(400).json({ error: "Title and date are required" });

  const id = events.length + 1;
  const newEvent = { id, title: title.trim(), date };
  events.push(newEvent);
  res.json(newEvent);
});

app.delete("/events/:id", (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter(e => e.id !== id);
  res.json({ success: true });
});

////////////////////////
// Start server
////////////////////////
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
