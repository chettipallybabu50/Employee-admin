// import { NextApiRequest, NextApiResponse } from "next";
// import db from "../../config/db"; // Ensure correct import
// import { RowDataPacket } from "mysql2";

// export default async function getemplyeeattendance( req: NextApiRequest,
//     res: NextApiResponse){

//         try{
//             console.log("req.body", req.body)
//             const { date } = req.body
//             const formattedDate = convertDateToMySQLFormat(date);
//            console.log("---->>formattedDate", formattedDate);
//             console.log('---->>formattedDate', formattedDate)

//             const query = `SELECT * FROM Employeeattendance WHERE date = ?`;
//             const [rows] = await db.query<RowDataPacket[]>(query, [formattedDate]);
//             console.log("Database result:", rows);
//             console.log("Number of rows:", rows.length);
//             if (rows.length){
//                 res.status(200).json({
//                     data:rows,
//                     status: true,
//                     message: "data fetched succefully"
//                });
//             }
//             else{
//                 res.status(200).json({
//                     status: false,
//                     data:[],
//                     message:"No Data found"
//                 })

//             }
          
            
//         }
//         catch(error : any){
//             console.error("Database Error:", error);
//             res.status(500).json({
//                  message: "Database Error", error: error.message });
//         }

//  }


//  function convertDateToMySQLFormat(inputDate: string): string {
//     const [day, month, year] = inputDate.split("/").map(Number);
//     return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
//   }



import { parse, format } from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";
import db from "../../config/db";
import { RowDataPacket } from "mysql2";

export default async function getEmployeeAttendance(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("req.body", req.body);

    let { date } = req.body;
    if (!date) {
        date = "15/2/2025";
      }

    // Convert various formats into "YYYY-MM-DD"
    const formattedDate = convertToMySQLDate(date);
    console.log("---->>formattedDate", formattedDate);

    const query = `SELECT * FROM Employeeattendance WHERE date = ?`;
    const [rows] = await db.query<RowDataPacket[]>(query, [formattedDate]);

    console.log("Database result:", rows);
    console.log("Number of rows:", rows.length);

    if (rows.length) {
      res.status(200).json({
        data: rows,
        status: true,
        message: "Data fetched successfully",
      });
    } else {
      res.status(200).json({
        status: false,
        data: [],
        message: "No Data found",
      });
    }
  } catch (error: any) {
    console.error("Database Error:", error);
    res.status(500).json({
      message: "Database Error",
      error: error.message,
    });
  }
}

// Universal Date Format Conversion
function convertToMySQLDate(inputDate: string): string {
  try {
    // Try different possible date formats
    const parsedDate = parse(inputDate, "dd/MM/yyyy", new Date());
    return format(parsedDate, "yyyy-MM-dd");
  } catch (error) {
    throw new Error("Invalid date format");
  }
}
