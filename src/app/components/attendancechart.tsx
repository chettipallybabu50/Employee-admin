"use client";
import { useEffect, useState } from "react";
import { FiFilter } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, LabelList, PieChart, Pie, Cell } from "recharts";

export default function AttendanceDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [date, setDate] = useState<Dayjs | null>(null);
  const [todayattnedancedata, settodayattnedancedata] = useState<{ name: string; count: number; percentage: number; fill: string }[]>([]);
  const [todaypieData, todaysetPieData] = useState<{ name: string; value: number }[]>([]);
  const [departmentData, setDepartmentData] = useState([]);
  

  const filterOptions: string[] = ["Daily", "Monthly", "Yearly", "Department"];


  const COLORS = ["#4CAF50", "#F44336"]; // Green for Present, Red for Absent


  // API Calling 

  useEffect(() => {
    fetch("/api/gettodayattendance")
      .then((res) => res.json())
      .then((data) => {
        console.log("emp data", data)
        if (data.status) {
          console.log("data--", data.data)
          const { presentCount, absentCount, totalEmployees } = data;

          console.log("presentCount------->>>", presentCount)
          console.log("absentCount--------->>>", absentCount)
          console.log("totalEmployees-------->>", totalEmployees)

          const formattedData = [
            { name: "Present", count: presentCount, percentage: (presentCount / totalEmployees) * 100, fill: "#4CAF50" },
            { name: "Absent", count: absentCount, percentage: (absentCount / totalEmployees) * 100, fill: "#F44336" }
          ];
          settodayattnedancedata(formattedData)

          const formattedPieData = [
            { name: "Present", value: presentCount },
            { name: "Absent", value: absentCount }
          ];

          todaysetPieData(formattedPieData)
          

          console.log("data--presentCount", data.presentCount)
          console.log("data--departmentData --->>>", data.departmentData[0])
          console.log("data--absentCount", data.absentCount)
          console.log("data--totalEmployees", data.totalEmployees)
          console.log("data--departmentCount", data.departmentCount)
          const formattedDepartmentData = data.departmentData.map((dept: any) => ({
            name: dept.Department,  // X-axis (Department name)
            Present: Number(dept.total_present), // Convert to number (Y-axis)
            Absent: Number(dept.total_absent),   // Convert to number (Y-axis)
          }));
          console.log("Formatted Bar Chart Data: ", formattedDepartmentData);
          setDepartmentData(formattedDepartmentData);

        }
        else {
          console.log("No attendance data found for today");

        }
      })
      .catch((err) => console.error("Error fetching attendance data:", err));
  }, []);


  const handleFilterSelect = (option: string) => {
    setSelectedFilters((prev: string[]) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  const removeFilter = (option: string) => {
    setSelectedFilters((prev: string[]) => prev.filter((item) => item !== option));
  };

  const clearFilters = () => {
    setSelectedFilters([]);
    setIsOpen(false);
  };

  return (
    <div>
      {/* <div className="relative flex items-center gap-3 p-4">
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 bg-gray-700 text-white rounded hover:bg-gray-600"
      >
        <FiFilter size={20} /> Filter
      </button>

              
      
      <div className="flex items-center gap-2 flex-wrap">
        {selectedFilters.map((filter: string) => (
          <div key={filter} className="flex items-center bg-gray-300 rounded border border-gray-400 p-1">
            {filter === "Daily" ? (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select a date"
                  value={date}
                  sx={{
                    width: 140, 
                    "& .MuiInputBase-root": {
                      height: "36px",
                      fontSize: "12px",
                      backgroundColor: "transparent", 
                    },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "6px",
                    },
                  }}
                />
              </LocalizationProvider>
            ) : filter === "Monthly" ?(
              <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select a Month"
                value={date}
                
                sx={{
                  width: 140, 
                  "& .MuiInputBase-root": {
                    height: "36px",
                    fontSize: "12px",
                    backgroundColor: "transparent", 
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "6px",
                  },
                }}
              />
            </LocalizationProvider>
            ) : filter === "Yearly" ?(
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select Year"
                  value={date}
                 
                  sx={{
                    width: 140, 
                    "& .MuiInputBase-root": {
                      height: "36px",
                      fontSize: "12px",
                      backgroundColor: "transparent", 
                    },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "6px",
                    },
                  }}
                />
              </LocalizationProvider>

            )
            : (
              filter
            )}

            
            <button
              className="ml-2 w-6 h-6 flex items-center justify-center bg-gray-500 rounded-full text-white hover:bg-gray-700 transition"
              onClick={() => removeFilter(filter)}
            >
              <IoClose size={14} />
            </button>
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="absolute top-14 left-4 bg-white shadow-md rounded p-4 w-48">
          {filterOptions.map((option: string) => (
            <div key={option} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedFilters.includes(option)}
                onChange={() => handleFilterSelect(option)}
              />
              <span>{option}</span>
            </div>
          ))}

        
          <div className="flex justify-between mt-4">
            <button
              onClick={clearFilters}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Clear
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div> */}


      {/*  below code for graph's */}
      <div className="p-6 bg-white  rounded-lg w-full">
        <h2 className="text-xl font-bold text-center mb-4">Today's Attendance</h2>

        {/* Row Layout: Bar Chart & Pie Chart Side by Side */}
        <div className="flex justify-center items-center gap-8">

          {/* Bar Chart */}
          <div className="w-1/2 shadow-lg border border-gray-300 rounded-lg p-4 bg-white">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={todayattnedancedata} barSize={50}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3B82F6">
                  {/* <LabelList
                  dataKey="count"
                  position="top"
                  formatter={(value: any, entry: { percentage: number | undefined; }) =>
                    entry && entry.percentage !== undefined
                      ? `${value} (${entry.percentage.toFixed(1)}%)`
                      : value
                  }
                /> */}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="w-1/2 shadow-lg border border-gray-300 rounded-lg p-4 bg-white">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={todaypieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                >
                  {todaypieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>


      <div className="p-6 bg-white  rounded-lg w-full">
        <h2 className="text-xl font-bold text-center mb-4">Today's Attendance</h2>

        {/* Row Layout: Bar Chart & Pie Chart Side by Side */}
        <div className="flex justify-center items-center gap-8">

          {/* Bar Chart */}
          <div className="w-1/2 shadow-lg border border-gray-300 rounded-lg p-4 bg-white">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData} barSize={50}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" 
              
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Present" fill="#4CAF50" stackId="a" minPointSize={5} />
                <Bar dataKey="Absent" fill="#F44336"  stackId="a" minPointSize={5}/>
                  {/* <LabelList
                  dataKey="count"
                  position="top"
                  formatter={(value: any, entry: { percentage: number | undefined; }) =>
                    entry && entry.percentage !== undefined
                      ? `${value} (${entry.percentage.toFixed(1)}%)`
                      : value
                  }
                /> */}
                
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          {/* <div className="w-1/2 shadow-lg border border-gray-300 rounded-lg p-4 bg-white">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={todaypieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                >
                  {todaypieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div> */}

        </div>
      </div>



    </div>
  );
}
