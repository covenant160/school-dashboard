"use client";
import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from "recharts";

const backendUrl = "http://localhost:5000";

interface Attendance {
  id: number;
  studentId: number;
  studentName?: string;
  present: number;
  date: string;
}

interface Student {
  id: number;
  name: string;
  grade: string;
  parent: string;
}

interface Teacher {
  id: number;
  name: string;
  subject: string;
}

const COLORS = ["#4ade80", "#f87171"]; // green = present, red = absent

const HomePage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [studentName, setStudentName] = useState("");
  const [studentGrade, setStudentGrade] = useState("");
  const [studentParent, setStudentParent] = useState("");

  const [teacherName, setTeacherName] = useState("");
  const [teacherSubject, setTeacherSubject] = useState("");

  const [attendanceStudentId, setAttendanceStudentId] = useState<number | "">("");
  const [attendancePresent, setAttendancePresent] = useState<number>(1);

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsRes, teachersRes, attendanceRes] = await Promise.all([
        fetch(`${backendUrl}/students`),
        fetch(`${backendUrl}/teachers`),
        fetch(`${backendUrl}/attendance`),
      ]);

      if (!studentsRes.ok || !teachersRes.ok || !attendanceRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const studentsData: Student[] = await studentsRes.json();
      const teachersData: Teacher[] = await teachersRes.json();
      const attendanceData: Attendance[] = await attendanceRes.json();

      setStudents(studentsData);
      setTeachers(teachersData);
      setAttendance(attendanceData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute attendance stats
  const presentCount = attendance.filter((a) => a.present === 1).length;
  const absentCount = attendance.length - presentCount;

  // Prepare last 7 days trend
  const today = new Date();
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const presentToday = attendance.filter(a => a.date === dateStr && a.present === 1).length;
    return { date: dateStr.split("-")[2], present: presentToday };
  }).reverse();

  // Handlers
  const addStudent = async () => {
    if (!studentName || !studentGrade || !studentParent) return alert("Fill all fields!");
    try {
      await fetch(`${backendUrl}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: studentName, grade: studentGrade, parent: studentParent }),
      });
      setStudentName(""); setStudentGrade(""); setStudentParent("");
      fetchData();
    } catch (err) { console.error(err); }
  };

  const addTeacher = async () => {
    if (!teacherName || !teacherSubject) return alert("Fill all fields!");
    try {
      await fetch(`${backendUrl}/teachers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: teacherName, subject: teacherSubject }),
      });
      setTeacherName(""); setTeacherSubject("");
      fetchData();
    } catch (err) { console.error(err); }
  };

  const markAttendance = async () => {
    if (!attendanceStudentId) return alert("Select a student");

    const todayStr = new Date().toISOString().split("T")[0];
    const alreadyMarked = attendance.find(
      a => a.studentId === attendanceStudentId && a.date === todayStr
    );
    if (alreadyMarked) return alert("Attendance already marked for today!");

    try {
      await fetch(`${backendUrl}/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: attendanceStudentId,
          present: attendancePresent,
          date: todayStr,
        }),
      });
      await fetchData();
      setAttendanceStudentId("");
    } catch (err) { console.error(err); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="text-gray-600 text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url("/1 background image.jpg")' }}>
      <div className="bg-opacity-60 min-h-screen">
        <Navbar />
        <main className="p-6">

          {/* Welcome */}
          <div className="mb-8 text-white">
            <h1 className="text-4xl font-extrabold">Welcome to the School Dashboard 🎓</h1>
            <p className="mt-2 text-lg text-gray-200">
              Manage students, teachers, attendance, and grades effortlessly.
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Today is {today.toLocaleDateString()}, {today.toLocaleTimeString()}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-600 bg-opacity-80 text-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold">Total Students</h2>
              <p className="text-3xl font-bold mt-2">{students.length}</p>
            </div>
            <div className="bg-green-600 bg-opacity-80 text-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold">Total Teachers</h2>
              <p className="text-3xl font-bold mt-2">{teachers.length}</p>
            </div>
            <div className="bg-yellow-500 bg-opacity-80 text-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold">Attendance Records</h2>
              <p className="text-3xl font-bold mt-2">{attendance.length}</p>
            </div>
            <div className="bg-purple-600 bg-opacity-80 text-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold">Grades Assigned</h2>
              <p className="text-3xl font-bold mt-2">{students.length}</p>
            </div>
          </div>

          {/* PieChart */}
          <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-700">Today&apos;s Attendance</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Present", value: presentCount },
                    { name: "Absent", value: absentCount }
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {[
                    { name: "Present", value: presentCount },
                    { name: "Absent", value: absentCount }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* LineChart */}
          <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-700">Attendance Trend (Last 7 Days)</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="present" stroke="#4ade80" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Actions Forms */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Add Student */}
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold mb-2">Add Student</h3>
              <input placeholder="Name" value={studentName} onChange={e => setStudentName(e.target.value)} className="border p-1 mb-1 w-full"/>
              <input placeholder="Grade" value={studentGrade} onChange={e => setStudentGrade(e.target.value)} className="border p-1 mb-1 w-full"/>
              <input placeholder="Parent" value={studentParent} onChange={e => setStudentParent(e.target.value)} className="border p-1 mb-1 w-full"/>
              <button onClick={addStudent} className="bg-blue-500 text-white px-2 py-1 rounded mt-1">Add</button>
            </div>

            {/* Add Teacher */}
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold mb-2">Add Teacher</h3>
              <input placeholder="Name" value={teacherName} onChange={e => setTeacherName(e.target.value)} className="border p-1 mb-1 w-full"/>
              <input placeholder="Subject" value={teacherSubject} onChange={e => setTeacherSubject(e.target.value)} className="border p-1 mb-1 w-full"/>
              <button onClick={addTeacher} className="bg-green-500 text-white px-2 py-1 rounded mt-1">Add</button>
            </div>

            {/* Mark Attendance */}
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold mb-2">Mark Attendance</h3>
              <select value={attendanceStudentId} onChange={e => setAttendanceStudentId(Number(e.target.value))} className="border p-1 mb-1 w-full">
                <option value="">Select Student</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <select value={attendancePresent} onChange={e => setAttendancePresent(Number(e.target.value))} className="border p-1 mb-1 w-full">
                <option value={1}>Present</option>
                <option value={0}>Absent</option>
              </select>
              <button onClick={markAttendance} className="bg-yellow-500 text-white px-2 py-1 rounded mt-1">Mark</button>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-700">Attendance Details</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border">Date</th>
                    <th className="px-4 py-2 border">Student</th>
                    <th className="px-4 py-2 border">Present</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((a) => {
                    const student = students.find(s => s.id === a.studentId);
                    return (
                      <tr key={a.id}>
                        <td className="px-4 py-2 border">{a.date}</td>
                        <td className="px-4 py-2 border">{student?.name || a.studentName || "Unknown"}</td>
                        <td className={`px-4 py-2 border font-bold ${a.present ? "text-green-600" : "text-red-600"}`}>
                          {a.present ? "Present" : "Absent"}
                        </td>
                        <td className="px-4 py-2 border">
                          <button
                            className="bg-yellow-400 text-white px-2 py-1 rounded"
                            onClick={async () => {
                              try {
                                const updated = await fetch(`${backendUrl}/attendance/${a.id}`, {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ present: a.present ? 0 : 1 }),
                                }).then(res => res.json());
                                setAttendance(prev => prev.map(att => att.id === a.id ? updated : att));
                              } catch (err) { console.error(err); }
                            }}
                          >
                            
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-700">Upcoming School Events</h2>
            <ul className="list-disc pl-5">
              <li>Science Fair - 2025-10-05</li>
              <li>Sports Day - 2025-10-12</li>
              <li>Parent-Teacher Meeting - 2025-10-20</li>
            </ul>
          </div>

        </main>
      </div>
    </div>
  );
};

export default HomePage;
