"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaBox, FaBuilding, FaCheck, FaDollarSign, FaProjectDiagram, FaTimes, FaUser } from "react-icons/fa";

export default function DepartmentsCard() {
  const count = 10; // 🔹 Static count (Can make dynamic later)
  const [empcount, setempcount]= useState(0)
  const [depcount, setdepcount]= useState(0)
  const [presentcount , setpresentcount] = useState(0)
  const [absentcount, setabsentcount] = useState(0)
  useEffect(() => {
    fetch("/api/gettodayattendance")
      .then((res) => res.json())
      .then((data) => 
        {
          console.log("emp data", data)
          if(data.status){
            console.log("data--",data.data)
            console.log("data--presentCount",data.presentCount)
            console.log("data--absentCount",data.absentCount)
            console.log("data--totalEmployees",data.totalEmployees)
            console.log("data--departmentCount",data.departmentCount)
            setempcount(data.totalEmployees)
            // const uniqueDepartments = [...new Set(data.
            //   data.map((emp: { Department: any; }) => emp.Department))];
              setdepcount(data.departmentCount)

              // console.log('uniqueDepartments', uniqueDepartments)
//               const statusCount = data.data.reduce((count: { [x: string]: any; }, emp: { Status: string | number; }) => {
//                 count[emp.Status] = (count[emp.Status] || 0) + 1;
//                 return count;
//             }, {});
//             console.log(`Present Count: ${statusCount["Present"] || 0}`);
// console.log(`Absent Count: ${statusCount["Absent"] || 0}`);
                setpresentcount(data.presentCount)
                setabsentcount(data.absentCount)

          }
          else{
            console.log("No attendance data found for today");
            setempcount(0);
            setdepcount(0);
            setpresentcount(0);
            setabsentcount(0);
          }
        })
      .catch((err) => console.error("Error fetching attendance data:", err));
  }, []);

  return (
   

<div  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Departments Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative bg-gradient-to-r from-blue-200 to-blue-400 text-gray-900 shadow-md hover:shadow-lg transition-transform rounded-xl w-[21rem] h-44 p-6 flex flex-col justify-between"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Departments</h2>
          <span className="p-3 bg-white/30 rounded-full">
            <FaBuilding className="text-3xl" />
          </span>
        </div>
        <p className="text-5xl font-bold">{depcount}</p>
      </motion.div>

      {/* Employees Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative bg-gradient-to-r from-green-200 to-green-400 text-gray-900 shadow-md hover:shadow-lg transition-transform rounded-xl w-[21rem] h-44 p-6 flex flex-col justify-between"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Employees</h2>
          <span className="p-3 bg-white/30 rounded-full">
            <FaUser className="text-3xl" />
          </span>
        </div>
        <p className="text-5xl font-bold">{empcount}</p>
      </motion.div>

      {/* Attendance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative bg-gradient-to-r from-yellow-200 to-yellow-400 text-gray-900 shadow-md hover:shadow-lg transition-transform rounded-xl w-[21rem] h-44 p-6 flex flex-col justify-between"
      >
        <h2 className="text-lg font-semibold">Attendance</h2>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaCheck className="text-3xl text-green-700" />
            <span className="text-4xl font-bold">{presentcount}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaTimes className="text-3xl text-red-600" />
            <span className="text-4xl font-bold">{absentcount}</span>
          </div>
        </div>
      </motion.div>

      {/* Today's Sales Card */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative bg-gradient-to-r from-purple-200 to-purple-400 text-gray-900 shadow-md hover:shadow-lg transition-transform rounded-xl w-[15rem] h-44 p-6 flex flex-col justify-between"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Today's Sales</h2>
          <span className="p-3 bg-white/30 rounded-full">
            <FaDollarSign className="text-3xl" />
          </span>
        </div>
        <p className="text-5xl font-bold">$1,250</p>
      </motion.div> */}

      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative bg-gradient-to-r from-purple-200 to-purple-400 text-gray-900 shadow-md hover:shadow-lg transition-transform rounded-xl w-[15rem] h-44 p-6 flex flex-col justify-between"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Today's Sales</h2>
          <span className="p-3 bg-white/30 rounded-full">
            <FaBox className="text-3xl" />
          </span>
        </div>
        <p className="text-5xl font-bold">120</p> 
      </motion.div> */}

      
    </div>


  );

  
}
