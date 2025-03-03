"use client";
import { useEffect, useState } from "react";
import { FiFilter } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, LabelList, PieChart, Pie, Cell, LineChart, Line } from "recharts";

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
        if (data.status) {
          const { presentCount, absentCount, totalEmployees } = data;

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

          const formattedDepartmentData = data.departmentData.map((dept: any) => ({
            name: dept.Department,  // X-axis (Department name)
            Present: Number(dept.total_present), // Convert to number (Y-axis)
            Absent: Number(dept.total_absent),   // Convert to number (Y-axis)
          }));
          setDepartmentData(formattedDepartmentData);

        } else {
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
      <div className="p-6 bg-white rounded-lg w-full">
        <h2 className="text-xl font-bold text-center mb-4">Today's Attendance</h2>

        {/* Row Layout: Bar Chart & Pie Chart Side by Side */}
        <div className="flex justify-center items-center gap-8">
          <div className="w-1/2 shadow-lg border border-gray-300 rounded-lg p-4 bg-white">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={todayattnedancedata} barSize={50}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

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

      {/* Line Chart for Department-wise Attendance */}
      <div className="p-6 bg-white rounded-lg w-full">
        <h2 className="text-xl font-bold text-center mb-4">Department-wise Attendance</h2>
        <div className="flex justify-center items-center">
          <div className="w-full shadow-lg border border-gray-300 rounded-lg p-4 bg-white">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Present" stroke="#4CAF50" />
                <Line type="monotone" dataKey="Absent" stroke="#F44336" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

