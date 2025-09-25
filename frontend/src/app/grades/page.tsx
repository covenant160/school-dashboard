"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

interface Student {
  id: number;
  name: string;
  grade: string; // current grade from backend
  parent: string;
  assignedGrade?: string; // for new grade input
}

const GradesPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const backendUrl = "http://localhost:5000"; // Backend URL

  // Fetch students from backend
  const fetchStudents = async () => {
    try {
      const res = await fetch(`${backendUrl}/students`);
      if (!res.ok) throw new Error("Failed to fetch students");
      const data: Student[] = await res.json();
      // Initialize assignedGrade with current grade
      const studentsWithAssigned = data.map((s) => ({
        ...s,
        assignedGrade: s.grade,
      }));
      setStudents(studentsWithAssigned);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle input change for assignedGrade
  const handleGradeChange = (id: number, value: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, assignedGrade: value } : s))
    );
  };

  // Submit grades to backend
  const submitGrades = async () => {
    try {
      // Send one POST request per student
      for (const s of students) {
        if (!s.assignedGrade) continue; // skip empty
        const res = await fetch(`${backendUrl}/grades`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId: s.id, grade: s.assignedGrade }),
        });
        if (!res.ok) throw new Error(`Failed to submit grade for ${s.name}`);
      }

      alert("Grades submitted successfully!");
      fetchStudents(); // refresh student data
    } catch (err) {
      console.error(err);
      alert("Failed to submit grades. Check console for details.");
    }
  };

  return (
    <div>
      <Navbar />
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Grades Management</h1>

        {/* Students Table */}
        <table className="min-w-full border">
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
                    className="border p-1 w-20"
                    value={s.assignedGrade || ""}
                    onChange={(e) => handleGradeChange(s.id, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Submit Button */}
        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2"
          onClick={submitGrades}
        >
          Submit Grades
        </button>
      </main>
    </div>
  );
};

export default GradesPage;
