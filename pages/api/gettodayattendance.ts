
import { NextApiRequest, NextApiResponse } from "next";
import db from "../../config/db";
import { RowDataPacket } from "mysql2";
export default async function todaysempattendance(req: NextApiRequest, res: NextApiResponse){

    try{

        // Get today's date in 'YYYY-MM-DD' format
    const current = new Date();
    current.setMinutes(current.getMinutes() - current.getTimezoneOffset());
    const today = current.toISOString().split("T")[0];

console.log('------>>>currentDate', today);

    // const query = `SELECT * FROM Employeeattendance WHERE date = ?`;
    // const [result] = await db.query<RowDataPacket[]>(query, [today]);

    const query = `
    SELECT *,
      (SELECT COUNT(*) FROM Employeeattendance WHERE Status = 'Present' AND Date = ?) AS presentCount,
      (SELECT COUNT(*) FROM Employeeattendance WHERE Status = 'Absent' AND Date = ?) AS absentCount,
      (SELECT COUNT(DISTINCT ID) FROM Employeeattendance WHERE Date = ?) AS totalEmployees,
     (SELECT COUNT(DISTINCT Department) FROM Employeeattendance WHERE Date = ?) AS departmentCount
    FROM Employeeattendance 
    WHERE Date = ?;
  `;

  const [result] = await db.query<RowDataPacket[]>(query, [
    today,
    today,
    today,
    today,
    today,
  ]);
    console.log('------>>result', result.length)

    const departmentQuery = `
    SELECT Department,
           COUNT(*) AS total_employees,
           SUM(CASE WHEN Status = 'Present' THEN 1 ELSE 0 END) AS total_present,
           SUM(CASE WHEN Status = 'Absent' THEN 1 ELSE 0 END) AS total_absent
    FROM Employeeattendance
    WHERE Date = ?
    GROUP BY Department;
    `;

    const [departmentResult] = await db.query<RowDataPacket[]>(departmentQuery, [today]);

    if(result.length>0){
        // const presentCount = result.filter((emp) => emp.Status === "Present").length;
        // const absentCount = result.filter((emp) => emp.Status === "Absent").length;
        res.status(200).json({
            status: true,
            message: "Data fetched successfully",
            presentCount: result[0]?.presentCount ?? 0,
            absentCount: result[0]?.absentCount ?? 0,
            totalEmployees: result[0]?.totalEmployees ?? 0,
            departmentCount: result[0]?.departmentCount ?? 0,
            data: result,
            departmentData: departmentResult,
    
        })
    }
    else{
        res.status(200).json({
            status:false,
            message:"No attendance data found for today",
            presentCount: 0,
            absentCount: 0,
            totalEmployees: 0,
            departmentCount: 0,
            data: [],
            departmentData: [],
        })
    }
    }
    catch(error){
        console.log('today attendance emp',error)
        return res.status(500).json({
            status: false,
            error: "Internal Server Error",
          });


    }
 }