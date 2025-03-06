// import type { NextApiRequest, NextApiResponse } from "next";
// import db from "../../config/db";
// import { RowDataPacket } from "mysql2";
// import * as ExcelJS from "exceljs";


// interface DataRow {
//   ID: number;
//   Name: string;
//   Department: string; 
//   Status: string;
// }

// export default async function generateExcel(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     console.log("---->> the request is coming");
//     const { date } = req.query;
    
//     let today: string;
//     if (date) {
//       today = date as string;
//     } else {
//       const current = new Date();
//       current.setMinutes(current.getMinutes() - current.getTimezoneOffset());
//       today = current.toISOString().split("T")[0];
//     }

//     console.log("----->>>today", today);
//     const query = `SELECT * FROM Employeeattendance WHERE Date = ? AND Status = 'Present'`;
//     const [rows] = await db.query<RowDataPacket[]>(query, [today]);

//     console.log("rows", rows);
//     console.log("rows length", rows.length);

//     if (!rows.length) {
//       return res.status(404).json({ status: false, message: "No records found", data: [] });
//     }

//     // Create a new Excel workbook and worksheet
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet("Employee Attendance");

//     // Define columns for the worksheet
//     worksheet.columns = [
//       { header: "SI. NO", key: "si_no", width: 5 },
//       { header: "ID", key: "ID", width: 5 },
//       { header: "Name", key: "Name", width: 20 },
//       { header: "Department", key: "Department", width: 20 },
//       { header: "Status", key: "Status", width: 15 },
//       { header: "In Time", key: "In Time", width: 15 },
//     ];

//     worksheet.getRow(1).eachCell((cell) => {
//         cell.font = { bold: true, color: { argb: "FFFFFF" } }; // White text
//         cell.fill = {
//           type: "pattern",
//           pattern: "solid",
//           fgColor: { argb: "4F81BD" }, // Light Blue background
//         };
//         // cell.alignment = { horizontal: "center", vertical: "middle" }; // Center align
//       });

//     // Add rows to the worksheet
//     // rows.forEach((row) => {
//     //   worksheet.addRow(row);
//     // });

//     rows.forEach((row, index) => {
//         worksheet.addRow({
//           si_no: index + 1, // Auto-incremented SI. NO
//           ...row, // Spread existing row data
//         });
//       });

//     // Set response headers for Excel file
//     res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
//     res.setHeader("Content-Disposition", `attachment; filename=attendance_${today}.xlsx`);

//     // Write the workbook to a buffer and send it in the response
//     const buffer = await workbook.xlsx.writeBuffer();
//     res.status(200).send(buffer);
//   } catch (error) {
//     console.error("Error generating Excel:", error);
//     res.status(500).json({ status: false, message: "Internal Server Error" });
//   }
// }




import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../config/db";
import { RowDataPacket } from "mysql2";
import * as ExcelJS from "exceljs";

interface DataRow {
  ID: number;
  Name: string;
  Department: string;
  Status: string;
  "In Time"?: string;
  "Out Time"?: string;
}

export default async function generateExcel(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log("---->> The request is coming");
    console.log('----->>>req.query,',req.query)
    const { date, timeType } = req.query;
    console.log('----->>>timeType', timeType)
    
    let today: string;
    if (date) {
      today = date as string;
    } else {
      const current = new Date();
      current.setMinutes(current.getMinutes() - current.getTimezoneOffset());
      today = current.toISOString().split("T")[0];
    }

    console.log("----->>> Today:", today);
    
    const query = `SELECT * FROM Employeeattendance WHERE Date = ? AND Status = 'Present'`;
    const [rows] = await db.query<RowDataPacket[]>(query, [today]);

    console.log("Rows:", rows);
    console.log("Rows length:", rows.length);

    if (!rows.length) {
      return res.status(404).json({ status: false, message: "No records found", data: [] });
    }

    // Determine the correct column to display (either "In Time" or "Out Time")
    const timeColumn = timeType === "OutTime" ? "Out Time" : "In Time";
    console.log('---->>timeColumn', timeColumn)

    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employee Attendance");

    // Define columns for the worksheet
    worksheet.columns = [
      { header: "SI. NO", key: "si_no", width: 5 },
      { header: "ID", key: "ID", width: 5 },
      { header: "Name", key: "Name", width: 20 },
      { header: "Department", key: "Department", width: 20 },
      { header: "Status", key: "Status", width: 15 },
      { header: timeColumn, key: timeColumn, width: 15 },
    ];
    console.log('worksheet.columns', worksheet.columns)

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFF" } }; // White text
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4F81BD" }, // Light Blue background
      };
    });

    // Add rows to the worksheet
    rows.forEach((row, index) => {
      worksheet.addRow({
        si_no: index + 1, // Auto-incremented SI. NO
        ID: row.ID,
        Name: row.Name,
        Department: row.Department,
        Status: row.Status,
        [timeColumn]: row[timeColumn] || "N/A", // Dynamically select In Time or Out Time
      });
    });

    // Set response headers for Excel file
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    // res.setHeader("Content-Disposition", `attachment; filename=attendance_$${timeType}_{today}.xlsx`);
    res.setHeader("Content-Disposition", `attachment; filename=attendance_${timeType}_${today}.xlsx`);


    // Write the workbook to a buffer and send it in the response
    const buffer = await workbook.xlsx.writeBuffer();
    res.status(200).send(buffer);
  } catch (error) {
    console.error("Error generating Excel:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
}
