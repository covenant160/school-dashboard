import React from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <h1 className="font-bold text-lg">School Management System</h1>
      <ul className="flex gap-6">
        <li className="hover:text-gray-200 cursor-pointer">
          <Link href="/">Dashboard</Link>
        </li>
        <li className="hover:text-gray-200 cursor-pointer">
          <Link href="/students">Students</Link>
        </li>
        <li className="hover:text-gray-200 cursor-pointer">
          <Link href="/teachers">Teachers</Link>
        </li>
        <li className="hover:text-gray-200 cursor-pointer">
          <Link href="/attendance">Attendance</Link>
        </li>
        <li className="hover:text-gray-200 cursor-pointer">
          <Link href="/grades">Grades</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
