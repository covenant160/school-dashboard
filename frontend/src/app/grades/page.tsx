"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

interface Student {
  id: number;
  name: string;
  grade: string;
  parent: string;
  assignedGrade?: string;
}

const GradesPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const backendUrl = "http://localhost:5000";

  // Fetch students from backend
  const fetchStudents = async () => {
    try {
      const res = await fetch(`${backendUrl}/students`);
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      const updated = data.map((s: Student) => ({
        ...s,
        assignedGrade: s.grade,
      }));
      setStudents(updated);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Update assigned grade locally
  const handleGradeChange = (id: number, grade: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, assignedGrade: grade } : s))
    );
  };

  // Submit grades to backend
  const submitGrades = async () => {
    try {
      const res = await fetch(`${backendUrl}/grades`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(students.map(({ id, assignedGrade }) => ({ id, grade: assignedGrade }))),
      });
      if (!res.ok) throw new Error("Failed to submit grades");
      alert("Grades submitted successfully!");
      fetchStudents(); // refresh data
    } catch (err) {
      console.error(err);
      alert("Error submitting grades. Check console for details.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Grades Management</h1>

        <table className="min-w-full border mb-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Current Grade</th>
              <th className="border p-2">Assign Grade</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td className="border p-2">{s.id}</td>
                <td className="border p-2">{s.name}</td>
                <td className="border p-2">{s.grade}</td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={s.assignedGrade || ""}
                    onChange={(e) => handleGradeChange(s.id, e.target.value)}
                    className="border p-1 w-full"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          className="bg-blue-600 text-white px-4 py-2"
          onClick={submitGrades}
        >
          Submit Grades
        </button>
      </div>
    </div>
  );
};

export default GradesPage;
