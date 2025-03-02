import fs from "fs";
import path from "path";
import csvParser from "csv-parser";
import { format } from "fast-csv";
import { NextApiRequest, NextApiResponse } from "next";

// Define a type for Employee Attendance Data
type AttendanceRecord = { [key: string]: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Only GET requests allowed" });
  }

  try {
  

    // Path to the attendance folder
    const folderPath: string = path.join(process.cwd(), "public", "csv-files");
    const csvFiles: string[] = fs.readdirSync(folderPath).filter(file => file.endsWith(".csv"));

    const mergedData: AttendanceRecord[] = [];

    for (const file of csvFiles) {
      const filePath: string = path.join(folderPath, file);
      const fileData: AttendanceRecord[] = await readCsvFile(filePath, file);
      console.log(`File: ${file}, Rows: ${fileData.length}`);
      mergedData.push(...fileData);
      console.log("Total Rows Before Writing:", mergedData.length);
    }

    // Write Merged Data into Single CSV File
    const outputFilePath: string = path.join(process.cwd(), "public", "attendance_history.csv");
    await writeCsvFile(outputFilePath, mergedData);

    let finalData = mergedData;
    // console.log('finalData', finalData)

    // 🔹 Filter Data by Date
    res.status(200).json({
      message: "Attendance merged successfully!",
      url: "/attendance_history.csv",
      data: finalData
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

// Function to read CSV file and add Date from File Name
const readCsvFile = (filePath: string, fileName: string): Promise<AttendanceRecord[]> => {
  return new Promise((resolve, reject) => {
    const data: AttendanceRecord[] = [];
    let isFirstRow = true;
    const match = fileName.match(/\d{4}-\d{2}-\d{2}/); // Extract YYYY-MM-DD from File Name
    const fileDate = match ? match[0] : "Unknown";

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        // if (isFirstRow) {
        //   isFirstRow = false; // Skip the first row (header)
        //   return;
        // }
        if (Object.values(row).every(value => String(value || "").trim() === "")) {
          return; // Skip empty rows
        }
        

        row["Date"] = fileDate; // Adding Date Field to Each Row
        data.push(row);
      })
      .on("end", () => resolve(data))
      .on("error", (error) => reject(error));
  });
};

// Function to Write Merged CSV File
const writeCsvFile = (filePath: string, data: AttendanceRecord[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    const ws = fs.createWriteStream(filePath);
    const csvStream = format({ headers: true });
    csvStream.pipe(ws);
    data.forEach((row) => csvStream.write(row));
    csvStream.end();
    ws.on("finish", resolve);
    ws.on("error", reject);
  });
};
