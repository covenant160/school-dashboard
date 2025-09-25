"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  UserGroupIcon,
  AcademicCapIcon,
  ClipboardIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";

const DashboardPage: React.FC = () => {
  const [totalStudents, setTotalStudents] = useState<number | null>(null);
  const [totalTeachers, setTotalTeachers] = useState<number | null>(null);
  const [totalAttendance, setTotalAttendance] = useState<number | null>(null);
  const [totalGrades, setTotalGrades] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, teachersRes, attendanceRes, gradesRes] =
          await Promise.allSettled([
            fetch("http://localhost:5000/students"),
            fetch("http://localhost:5000/teachers"),
            fetch("http://localhost:5000/attendance"),
            fetch("http://localhost:5000/grades"),
          ]);

        if (studentsRes.status === "fulfilled" && studentsRes.value.ok) {
          const data = await studentsRes.value.json();
          setTotalStudents(data.length);
        } else setError("⚠️ Could not load students");

        if (teachersRes.status === "fulfilled" && teachersRes.value.ok) {
          const data = await teachersRes.value.json();
          setTotalTeachers(data.length);
        } else setError("⚠️ Could not load teachers");

        if (attendanceRes.status === "fulfilled" && attendanceRes.value.ok) {
          const data = await attendanceRes.value.json();
          setTotalAttendance(data.length);
        } else setError("⚠️ Could not load attendance");

        if (gradesRes.status === "fulfilled" && gradesRes.value.ok) {
          const data = await gradesRes.value.json();
          setTotalGrades(data.length);
        } else setError("⚠️ Could not load grades");
      } catch (err) {
        console.error(err);
        setError("🚨 Backend server unreachable.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="p-6 text-center text-gray-600">⏳ Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="p-6">
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">{error}</div>
        )}

        <h1 className="text-3xl font-bold mb-2">
          Welcome to the School Management System 🎓
        </h1>
        <p className="text-gray-700 mb-6">
          Track students, teachers, attendance, and grades efficiently.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Students */}
          <div className="bg-blue-600 text-white p-6 rounded shadow hover:scale-105 transform transition duration-300">
            <div className="flex items-center space-x-3">
              <UserGroupIcon className="h-10 w-10" />
              <div>
                <h2 className="text-lg font-bold">Total Students</h2>
                <p className="text-3xl mt-1">{totalStudents ?? "N/A"}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-blue-200">
              Number of students currently enrolled.
            </p>
          </div>

          {/* Total Teachers */}
          <div className="bg-green-600 text-white p-6 rounded shadow hover:scale-105 transform transition duration-300">
            <div className="flex items-center space-x-3">
              <AcademicCapIcon className="h-10 w-10" />
              <div>
                <h2 className="text-lg font-bold">Total Teachers</h2>
                <p className="text-3xl mt-1">{totalTeachers ?? "N/A"}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-green-200">
              Number of teachers assigned to classes.
            </p>
          </div>

          {/* Attendance */}
          <div className="bg-yellow-500 text-white p-6 rounded shadow hover:scale-105 transform transition duration-300">
            <div className="flex items-center space-x-3">
              <ClipboardIcon className="h-10 w-10" />
              <div>
                <h2 className="text-lg font-bold">Attendance Records</h2>
                <p className="text-3xl mt-1">{totalAttendance ?? "N/A"}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-yellow-100">
              Total recorded attendance for students.
            </p>
          </div>

          {/* Grades */}
          <div className="bg-purple-600 text-white p-6 rounded shadow hover:scale-105 transform transition duration-300">
            <div className="flex items-center space-x-3">
              <PencilSquareIcon className="h-10 w-10" />
              <div>
                <h2 className="text-lg font-bold">Grades Assigned</h2>
                <p className="text-3xl mt-1">{totalGrades ?? "N/A"}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-purple-200">
              Number of grades entered for all students.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
