
import { NextApiRequest, NextApiResponse } from "next";
import db from "../../config/db";
import { RowDataPacket } from "mysql2";
export default async function todaysempattendance(req: NextApiRequest, res: NextApiResponse){

    try{

        const { date } = req.query;
        console.log('----->>>date', date)
        let  today : string
        if (date) {
            // Use the provided date (assuming it's in 'YYYY-MM-DD' format)
            today = date as string;
        }
        else{
            const current = new Date();
            current.setMinutes(current.getMinutes() - current.getTimezoneOffset());
             today = current.toISOString().split("T")[0];

        }

console.log('------>>>currentDate', today);

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

      // Get count based on In Time
      const inTimeQuery = `
      SELECT 
          COUNT(*) AS total_count,
          SUM(CASE WHEN \`In Time\` < '09:00:00' THEN 1 ELSE 0 END) AS before_9am,
          SUM(CASE WHEN \`In Time\` >= '09:00:00' AND \`In Time\` < '10:00:00' THEN 1 ELSE 0 END) AS between_9_to_10am,
          SUM(CASE WHEN \`In Time\` >= '10:00:00' AND \`In Time\` < '11:00:00' THEN 1 ELSE 0 END) AS between_10_to_11am,
          SUM(CASE WHEN \`In Time\` >= '11:00:00' THEN 1 ELSE 0 END) AS after_11am
      FROM Employeeattendance
      WHERE \`Date\` = ? AND \`Status\` = 'Present';
      `;

      const [inTimeResult] = await db.query<RowDataPacket[]>(inTimeQuery, [today]);

        // Get count based on Out Time
        const outTimeQuery = `
        SELECT 
            COUNT(*) AS total_count,
            SUM(CASE WHEN \`Out Time\` < '17:00:00' THEN 1 ELSE 0 END) AS before_5pm,
            SUM(CASE WHEN \`Out Time\` >= '17:00:00' AND \`Out Time\` < '18:00:00' THEN 1 ELSE 0 END) AS between_5_to_6pm,
            SUM(CASE WHEN \`Out Time\` >= '18:00:00' AND \`Out Time\` < '19:00:00' THEN 1 ELSE 0 END) AS between_6_to_7pm,
            SUM(CASE WHEN \`Out Time\` >= '19:00:00' THEN 1 ELSE 0 END) AS after_7pm
        FROM Employeeattendance
        WHERE \`Date\` = ? AND \`Status\` = 'Present';
        `;

        const [outTimeResult] = await db.query<RowDataPacket[]>(outTimeQuery, [today]);


    if(result.length>0){
        res.status(200).json({
            status: true,
            message: "Data fetched successfully",
            presentCount: result[0]?.presentCount ?? 0,
            absentCount: result[0]?.absentCount ?? 0,
            totalEmployees: result[0]?.totalEmployees ?? 0,
            departmentCount: result[0]?.departmentCount ?? 0,
            data: result,
            departmentData: departmentResult,
            inTimeData: inTimeResult[0] ?? {}, // In Time Data
            outTimeData: outTimeResult[0] ?? {} // Out Time Data
    
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