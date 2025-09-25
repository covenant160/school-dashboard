"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

interface Teacher {
  id: number;
  name: string;
  subject: string;
}

const TeachersPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);

  const backendUrl = "http://localhost:5000";

  // Fetch teachers from backend
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/teachers`);
      if (!res.ok) throw new Error("Failed to fetch teachers");
      const data: Teacher[] = await res.json();
      setTeachers(data); // store data in state
    } catch (err) {
      console.error("Error fetching teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Add teacher
  const addTeacher = async () => {
    if (!name.trim() || !subject.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/teachers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), subject: subject.trim() }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to add teacher");
      }

      const newTeacher: Teacher = await res.json();
      setTeachers((prev) => [...prev, newTeacher]); // update state immediately
      setName("");
      setSubject("");
    } catch (err) {
      console.error("Error adding teacher:", err);
      alert("Error adding teacher. Check console for details.");
    }
  };

  // Delete teacher
  const deleteTeacher = async (id: number) => {
    if (!confirm("Are you sure you want to delete this teacher?")) return;

    try {
      const res = await fetch(`${backendUrl}/teachers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete teacher");
      setTeachers((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error deleting teacher:", err);
      alert("Error deleting teacher. Check console for details.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Teachers Management</h1>

        {/* Add Teacher Form */}
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
            placeholder="Subject"
            className="border p-2"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2"
            onClick={addTeacher}
          >
            Add
          </button>
        </div>

        {/* Teachers Table */}
        {loading ? (
          <p>Loading teachers...</p>
        ) : teachers.length === 0 ? (
          <p>No teachers found.</p>
        ) : (
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">ID</th>
                <th className="border p-2">Name</th>
                
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t) => (
                <tr key={t.id}>
                  <td className="border p-2">{t.id}</td>
                  <td className="border p-2">{t.name}</td>
                  <td className="border p-2">{t.subject}</td>
                  <td className="border p-2">
                    <button
                      className="bg-red-600 text-white px-2 py-1"
                      onClick={() => deleteTeacher(t.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TeachersPage;
