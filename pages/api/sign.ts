import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

// Secret key for JWT (store securely in .env file)
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// Dummy User Data (Replace with DB logic)
const DUMMY_USER = {
  id: 1,
  username: "testuser",
  password: "password123",
};

// Define API handler
export default function sign(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { username, password } = req.body;
    console.log("username:", username);

    if (username !== DUMMY_USER.username || password !== DUMMY_USER.password) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: DUMMY_USER.id, username: DUMMY_USER.username }, SECRET_KEY, { expiresIn: "1h" });

    return res.status(200).json({ success: true, token });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
