
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBuilding } from "react-icons/fa";
import { motion } from "framer-motion";
import DepartmentsCard from "../components/deparmentsinfo";
import AttendanceChart from "../components/attendancechart";
export default function Dashboard() {
  const count = 10; 
  const router = useRouter();
  // const count = 10; 
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      router.push("/"); // Redirect to login if not authenticated
    }
  }, []);

  return (
    // <div className="p-6">
    //   <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
    //   <h3 className="mb-4">Pipe sales data</h3> 
    // </div>
    

  //   <motion.div
  //   initial={{ opacity: 0, y: 20 }}
  //   animate={{ opacity: 1, y: 0 }}
  //   whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5 }}
  //   transition={{ duration: 0.5, ease: "easeOut" }}
  //   className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl rounded-xl w-80 h-48 p-6 flex flex-col justify-between"
  // >
  //   {/* Card Header */}
  //   <div className="flex justify-between items-center">
  //     <h2 className="text-lg font-semibold tracking-wider">Departments</h2>
  //     <FaBuilding className="text-3xl opacity-80" />
  //   </div>

  //   {/* Animated Number Count */}
  //   <motion.p
  //     initial={{ opacity: 0, y: 20 }}
  //     animate={{ opacity: 1, y: 0 }}
  //     transition={{ duration: 0.8, delay: 0.3 }}
  //     className="text-5xl font-bold text-white drop-shadow-lg"
  //   >
  //      {count}
      
  //   </motion.p>

  //   {/* Subtle Glow Effect */}
  //   <div className="absolute inset-0 bg-white opacity-5 rounded-xl blur-xl"></div>
  // </motion.div>
    <div>
      <div className="mt-4 m-4">
        <DepartmentsCard />
      </div>
      <div>
        <AttendanceChart />
      </div>
    </div>
  );
}

