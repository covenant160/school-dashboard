"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

interface Student {
  id: number;
  name: string;
  grade: string;
  parent: string;
}

const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [parent, setParent] = useState("");
  const backendUrl = "http://localhost:5000"; // Backend base URL

  // Fetch all students
  const fetchStudents = async () => {
    try {
      const res = await fetch(`${backendUrl}/students`);
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Add student
  const addStudent = async () => {
    if (!name || !grade || !parent) {
      alert("Please fill all fields");
      return;
    }
    try {
      const res = await fetch(`${backendUrl}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, grade, parent }),
      });
      if (!res.ok) throw new Error("Failed to add student");
      setName("");
      setGrade("");
      setParent("");
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete student
  const deleteStudent = async (id: number) => {
    try {
      const res = await fetch(`${backendUrl}/students/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete student");
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Students Management</h1>

        {/* Add Student Form */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Name"
            className="border p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Grade"
            className="border p-2"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
          <input
            type="text"
            placeholder="Parent"
            className="border p-2"
            value={parent}
            onChange={(e) => setParent(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-4 py-2" onClick={addStudent}>
            Add
          </button>
        </div>

        {/* Students Table */}
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Grade</th>
              <th className="border p-2">Parent</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td className="border p-2">{s.id}</td>
                <td className="border p-2">{s.name}</td>
                <td className="border p-2">{s.grade}</td>
                <td className="border p-2">{s.parent}</td>
                <td className="border p-2">
                  <button
                    className="bg-red-600 text-white px-2 py-1"
                    onClick={() => deleteStudent(s.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default StudentsPage;
