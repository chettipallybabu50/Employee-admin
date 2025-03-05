"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaBox, FaBuilding, FaCheck, FaDollarSign, FaProjectDiagram, FaTimes, FaUser } from "react-icons/fa";

export default function DepartmentsCard() {
  const [empcount, setEmpCount] = useState(0);
  const [depcount, setDepCount] = useState(0);
  const [presentcount, setPresentCount] = useState(0);
  const [absentcount, setAbsentCount] = useState(0);

  useEffect(() => {
    fetch("/api/gettodayattendance")
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setEmpCount(data.totalEmployees);
          setDepCount(data.departmentCount);
          setPresentCount(data.presentCount);
          setAbsentCount(data.absentCount);
        } else {
          console.log("No attendance data found for today");
          setEmpCount(0);
          setDepCount(0);
          setPresentCount(0);
          setAbsentCount(0);
        }
      })
      .catch((err) => console.error("Error fetching attendance data:", err));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Departments Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-gradient-to-r from-blue-200 to-blue-400 text-gray-900 shadow-md hover:shadow-lg rounded-xl p-6 flex flex-col justify-between w-full min-h-[11rem]"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-base sm:text-lg font-semibold">Departments</h2>
            <span className="p-2 sm:p-3 bg-white/30 rounded-full">
              <FaBuilding className="text-2xl sm:text-3xl" />
            </span>
          </div>
          <p className="text-4xl sm:text-5xl font-bold">{depcount}</p>
        </motion.div>

        {/* Employees Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-gradient-to-r from-green-200 to-green-400 text-gray-900 shadow-md hover:shadow-lg rounded-xl p-6 flex flex-col justify-between w-full min-h-[11rem]"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-base sm:text-lg font-semibold">Employees</h2>
            <span className="p-2 sm:p-3 bg-white/30 rounded-full">
              <FaUser className="text-2xl sm:text-3xl" />
            </span>
          </div>
          <p className="text-4xl sm:text-5xl font-bold">{empcount}</p>
        </motion.div>

        {/* Attendance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-gradient-to-r from-yellow-200 to-yellow-400 text-gray-900 shadow-md hover:shadow-lg rounded-xl p-6 flex flex-col justify-between w-full min-h-[11rem]"
        >
          <h2 className="text-base sm:text-lg font-semibold">Attendance</h2>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <FaCheck className="text-2xl sm:text-3xl text-green-700" />
              <span className="text-3xl sm:text-4xl font-bold">{presentcount}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaTimes className="text-2xl sm:text-3xl text-red-600" />
              <span className="text-3xl sm:text-4xl font-bold">{absentcount}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
