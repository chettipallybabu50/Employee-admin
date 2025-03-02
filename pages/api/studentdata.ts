
import { NextApiRequest, NextApiResponse } from "next";
import db from "../../config/db"; // Ensure correct import
import { RowDataPacket } from "mysql2";

export default async function getstudentsdata(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("GET request received");

  try {
    // Ensure TypeScript correctly recognizes the query result as an array
    const [rows] = (await db.query("SELECT * FROM student")) as RowDataPacket[];

    console.log("Database result:", rows);
    console.log("Number of rows:", rows.length);

    if (rows.length > 0) {
      res.status(200).json({
        success: true,
        message: "Data fetched successfully",
        data: rows,
      });
    } else {
      res.status(200).json({
        success: false,
        message: "No records found",
        data: [],
      });
    }
  } catch (error: any) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Database Error", error: error.message });
  }
}
