"use client";
import { useEffect, useState } from "react";
import { FiFilter } from "react-icons/fi";
import { IoCloseCircle } from "react-icons/io5";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { IconButton } from "@mui/material";

export default function AttendanceDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [todayattnedancedata, settodayattnedancedata] = useState<{ name: string; count: number; percentage: number; fill: string }[]>([]);
  const [todaypieData, todaysetPieData] = useState<{ name: string; value: number }[]>([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [date2, setDate2] = useState<Dayjs | null>(dayjs());
  const [heading, setHeading] = useState(`Today's Attendance`);
  const [noData, setNoData] = useState(false);
  const [noLinedata, setLineData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [intimeempdata, setIntimeempdata] = useState<{ name: string; value: number }[]>([]);
  const [Outtimeempdata, setOuttimeempdata] = useState<{ name: string; value: number }[]>([]);


  const filterOptions: string[] = ["Daily", "Monthly", "Yearly", "Department"];
  const COLORS = ["#4CAF50", "#F44336"]; // Green for Present, Red for Absent


  // Dummy data for attendance distribution
const TimewiseattendanceData = [
  { name: 'Before 9 AM', value: 10 },
  { name: '9:00 - 9:30 AM', value: 20 },
  { name: '9:30 - 10:00 AM', value: 15 },
  { name: '10:00 - 10:30 AM', value: 25 },
  { name: '10:30 - 11:00 AM', value: 10 },
  { name: '11:00 - 11:30 AM', value: 10 },
  { name: 'After 11:30 AM', value: 10 },
];

const TimeCOLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


  // Fetch initial data (unchanged)
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/gettodayattendance");
        const data = await res.json();
        if (data.status) {
          const { presentCount, absentCount, totalEmployees } = data;
          const formattedData = [
            { name: "Present", count: presentCount, percentage: (presentCount / totalEmployees) * 100, fill: "#4CAF50" },
            { name: "Absent", count: absentCount, percentage: (absentCount / totalEmployees) * 100, fill: "#F44336" }
          ];
          settodayattnedancedata(formattedData);
          const formattedPieData = [
            { name: "Present", value: presentCount },
            { name: "Absent", value: absentCount }
          ];
          todaysetPieData(formattedPieData);
          const formattedDepartmentData = data.departmentData.map((dept: any) => ({
            name: dept.Department,
            Present: Number(dept.total_present),
            Absent: Number(dept.total_absent),
          }));
          setDepartmentData(formattedDepartmentData);

          //In Time Graph
          const { before_9am, between_9_to_10am, between_10_to_11am, after_11am } = data.inTimeData;
          const InTimewiseattendanceData = [
            { name: 'Before 9 AM', value: Number(before_9am) },
            { name: '9:00 - 10:00 AM', value: Number(between_9_to_10am) },
            { name: '10:00 - 11:00 AM', value: Number(between_10_to_11am) },
            { name: 'After 11:00 AM', value: Number(after_11am)},
          ];
          setIntimeempdata(InTimewiseattendanceData)

          // Out Time Graph
          const { before_5pm, between_5_to_6pm, between_6_to_7pm, after_7pm } = data.outTimeData;
          const OutTimewiseattendanceData = [
            { name: 'Before 5 PM', value: Number(before_5pm) },
            { name: '5:00 - 6:00 PM', value: Number(between_5_to_6pm) },
            { name: '6:00 - 7:00 PM', value: Number(between_6_to_7pm) },
            { name: 'After 7:00 PM', value: Number(after_7pm)},
          ];
          setOuttimeempdata(OutTimewiseattendanceData)


        }
      } catch (err) {
        console.error("Error fetching attendance data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Other functions (unchanged for brevity)
  const selecteddate = (bardate: Dayjs | null) => {
    if (bardate) {
      const headdate = bardate.format("DD MMM YYYY");
      setHeading(`${headdate} Attendance`);
      const formattedDate = bardate.format("YYYY-MM-DD");
      fetchattedanceforselectedate(formattedDate);
    }
  };

  const fetchattedanceforselectedate = async (formattedDate: string) => {
    try {
      const response = await fetch(`/api/gettodayattendance?date=${formattedDate}`);
      const data = await response.json();
      if (data.status) {
        setNoData(false);
        const { presentCount, absentCount, totalEmployees } = data;
        const formattedData = [
          { name: "Present", count: presentCount, percentage: (presentCount / totalEmployees) * 100, fill: "#4CAF50" },
          { name: "Absent", count: absentCount, percentage: (absentCount / totalEmployees) * 100, fill: "#F44336" }
        ];
        settodayattnedancedata(formattedData);
        const formattedPieData = [
          { name: "Present", value: presentCount },
          { name: "Absent", value: absentCount }
        ];
        todaysetPieData(formattedPieData);
      } else {
        setNoData(true);
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  const selectedLinedate = (linedate: Dayjs | null) => {
    if (linedate) {
      const formattedDate = linedate.format("YYYY-MM-DD");
      fetchattedanceforselecteLinedate(formattedDate);
    }
  };

  const fetchattedanceforselecteLinedate = async (formattedDate: string) => {
    try {
      const response = await fetch(`/api/gettodayattendance?date=${formattedDate}`);
      const data = await response.json();
      if (data.status) {
        setLineData(false);
        const { presentCount, absentCount, totalEmployees } = data;
        const formattedDepartmentData = data.departmentData.map((dept: any) => ({
          name: dept.Department,
          Present: Number(dept.total_present),
          Absent: Number(dept.total_absent),
        }));
        setDepartmentData(formattedDepartmentData);
      } else {
        setLineData(true);
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  const resetDate1 = () => {
    const currentdate = dayjs().format("YYYY-MM-DD");
    fetchattedanceforselectedate(currentdate);
    setDate(dayjs());
    setHeading("Today's Attendance");
  };

  const resetDate2 = () => {
    const linecurrentdat = dayjs().format("YYYY-MM-DD");
    setDate2(dayjs());
    fetchattedanceforselecteLinedate(linecurrentdat);
  };

  const downloadExcel = async (timeType: string) => {
    try {
      const response = await fetch(`/api/generateempxcell?timeType=${encodeURIComponent(timeType)}`);
  
      if (!response.ok) {
        throw new Error("Failed to download file");
      }
  
      // Get the filename from Content-Disposition header
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `attendance_${timeType.replace(/\s/g, "_")}.xlsx`; // Default name with timeType
  
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          filename = match[1]; // Extract filename from header
        }
      }
  
      // Convert response to blob
      const blob = await response.blob();
  
      // Create a temporary URL for the file
      const url = window.URL.createObjectURL(blob);
  
      // Create a hidden link element
      const a = document.createElement("a");
      a.href = url;
      a.download = filename; // Use extracted filename
      document.body.appendChild(a);
      a.click();
  
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  

 
  // const downloadinTime = async () => {
  //   try {
  //     const response = await fetch("/api/generateempxcell");
  
  //     if (!response.ok) {
  //       throw new Error("Failed to download file");
  //     }
  
  //     // Get the filename from Content-Disposition header
  //     const contentDisposition = response.headers.get("Content-Disposition");
  //     let filename = "attendance.xlsx"; // Default name
  
  //     if (contentDisposition) {
  //       const match = contentDisposition.match(/filename="?([^"]+)"?/);
  //       if (match && match[1]) {
  //         filename = match[1]; // Extract filename from header
  //       }
  //     }
  
  //     // Convert response to blob
  //     const blob = await response.blob();
  
  //     // Create a temporary URL for the file
  //     const url = window.URL.createObjectURL(blob);
  
  //     // Create a hidden link element
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = filename; // Use extracted filename
  //     document.body.appendChild(a);
  //     a.click();
  
  //     // Cleanup
  //     window.URL.revokeObjectURL(url);
  //     document.body.removeChild(a);
  //   } catch (error) {
  //     console.error("Error downloading file:", error);
  //   }
  // };
  

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      {loading ? (
        <div className="text-center mt-20">
          <p className="text-lg font-semibold">Loading data...</p>
          <div className="spinner mt-4 h-8 w-8 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mx-auto" />
        </div>
      ) : todayattnedancedata.length > 0 ? (
        <div className="space-y-6">
          {/* Attendance Section */}
          <div className="bg-white rounded-lg border border-gray-300 shadow-lg p-4 sm:p-6 max-w-7xl mx-auto">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-left mb-4">{heading}</h2>
            <div className="flex items-center justify-start mb-4 gap-2 sm:gap-4">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select Date"
                  value={date}
                  slotProps={{ textField: { size: "small", className: "w-full sm:w-40" } }}
                  onChange={(bardate) => {
                    setDate(bardate);
                    selecteddate(bardate);
                  }}
                />
              </LocalizationProvider>
              <IconButton onClick={resetDate1} className="text-gray-500 hover:text-red-500">
                <IoCloseCircle size={26} />
              </IconButton>
            </div>

            {/* Bar and Pie Charts */}
            <div className="flex flex-col lg:flex-row justify-center items-center gap-6">
              {!noData ? (
                <>
                  <div className="w-full lg:w-1/2 shadow-lg border border-gray-300 rounded-lg p-4 bg-white">
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
                  <div className="w-full lg:w-1/2 shadow-lg border border-gray-300 rounded-lg p-4 bg-white">
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
                </>
              ) : (
                <p className="text-left text-gray-500 font-semibold text-base sm:text-lg">
                  No data available for the selected date.
                </p>
              )}
            </div>
          </div>

          {/* Department-wise Attendance */}
          <div className="bg-white rounded-lg border border-gray-300 shadow-lg p-4 sm:p-6 max-w-7xl mx-auto">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-left mb-4">Department-wise Attendance</h2>
            <div className="flex items-center justify-start mb-4 gap-2 sm:gap-4">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select Date"
                  value={date2}
                  slotProps={{ textField: { size: "small", className: "w-full sm:w-40" } }}
                  onChange={(linedate) => {
                    setDate2(linedate);
                    selectedLinedate(linedate);
                  }}
                />
              </LocalizationProvider>
              <IconButton onClick={resetDate2} className="text-gray-500 hover:text-red-500">
                <IoCloseCircle size={26} />
              </IconButton>
            </div>
            <div className="flex justify-center items-center">
              {!noLinedata ? (
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
              ) : (
                <p className="text-left text-gray-500 font-semibold text-base sm:text-lg">
                  No data available for the selected date.
                </p>
              )}
            </div>
          </div>



          {/* time wise attendance */}
            <div className="bg-white rounded-lg border border-gray-300 shadow-lg p-4 sm:p-6 max-w-7xl mx-auto">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-left mb-4">Time-wise Attendance</h2>


              {/* Bar and Pie Charts */}
              <div className="flex flex-col lg:flex-row justify-center items-center gap-6">

                <div className="w-full lg:w-1/2 shadow-lg border border-gray-300 rounded-lg p-4 bg-white">
                  <div className="flex justify-between  mb-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">In Time</h3>
                    <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors
                    " onClick={() => downloadExcel("InTime")}>
                    Download
                    </button>
                  </div>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={intimeempdata}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {intimeempdata.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={TimeCOLORS[index % TimeCOLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full lg:w-1/2 shadow-lg border border-gray-300 rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">Out Time</h3>
                    <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                    onClick={() => downloadExcel("OutTime")}>
                      Download
                    </button>
                  </div>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={Outtimeempdata}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {Outtimeempdata.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={TimeCOLORS[index % TimeCOLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

              </div>
            </div>

        </div>
      ) : (
        <div className="text-center mt-20 text-base sm:text-lg">No attendance data available.</div>
      )}
    </div>
  );
}