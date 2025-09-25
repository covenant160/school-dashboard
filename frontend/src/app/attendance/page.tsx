"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

interface Student {
  id: number;
  name: string;
  grade: string;
  parent: string;
  present?: boolean; // attendance flag
}

const backendUrl = "http://localhost:5000";

const AttendancePage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);

  // Fetch students from backend
  const fetchStudents = async () => {
    try {
      const res = await fetch(`${backendUrl}/students`);
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      // Initialize present flag as false
      const updated = data.map((s: Student) => ({ ...s, present: false }));
      setStudents(updated);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Toggle attendance
  const toggleAttendance = (id: number) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, present: !s.present } : s
      )
    );
  };

  // Submit attendance to backend
  const submitAttendance = async () => {
    try {
      const attendanceRecords = students.map((s) => ({
        id: s.id,
        present: s.present,
      }));

      const res = await fetch(`${backendUrl}/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attendanceRecords),
      });

      if (!res.ok) throw new Error("Failed to submit attendance");

      alert("Attendance recorded successfully!");
      fetchStudents(); // refresh list and reset checkboxes
    } catch (err) {
      console.error(err);
      alert("Error submitting attendance. Check console for details.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Attendance</h1>
        <table className="min-w-full border mb-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Grade</th>
              <th className="border p-2">Present</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td className="border p-2">{s.id}</td>
                <td className="border p-2">{s.name}</td>
                <td className="border p-2">{s.grade}</td>
                <td className="border p-2 text-center">
                  <input
                    type="checkbox"
                    checked={s.present}
                    onChange={() => toggleAttendance(s.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="bg-blue-600 text-white px-4 py-2"
          onClick={submitAttendance}
        >
          Submit Attendance
        </button>
      </div>
    </div>
  );
};

export default AttendancePage;
