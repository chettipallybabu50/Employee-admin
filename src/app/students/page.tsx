"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Student {
  id: number;
  name: string;
  email: string;
  course: string;
}

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courseData, setCourseData] = useState<{ course: string; count: number }[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

  useEffect(() => {
    fetch("/api/studentdata") // Fetch data from API
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStudents(data.data);

          const courseCounts: Record<string, number> = {};
          data.data.forEach((student: Student) => {
            courseCounts[student.course] = (courseCounts[student.course] || 0) + 1;
          });

          const formattedData = Object.keys(courseCounts).map((course) => ({
            course,
            count: courseCounts[course],
          }));

          setCourseData(formattedData);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(students.length / rowsPerPage);
  const paginatedStudents = students.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Student Data</h1>

      <div className="flex gap-8">
        <div className="w-1/2 flex justify-center items-center border border-solid border-black">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseData}>
              <XAxis dataKey="course" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="w-1/2">
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-300 rounded-lg shadow-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">ID</th>
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Email</th>
                  <th className="py-3 px-6 text-left">Course</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {paginatedStudents.length > 0 ? (
                  paginatedStudents.map((student, index) => (
                    <tr
                      key={student.id}
                      className={`border-b border-gray-300 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                    >
                      <td className="py-3 px-6">{student.id}</td>
                      <td className="py-3 px-6">{student.name}</td>
                      <td className="py-3 px-6">{student.email}</td>
                      <td className="py-3 px-6">{student.course}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}