import { NextApiRequest, NextApiResponse } from "next";
export default function login(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
      const { username, password } = req.body;
      console.log("Received data:", username, password);
  
      // Process the login request (e.g., check database)
      res.status(200).json({ 
        success: true,
        message: "Login successful!" });
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  }
  