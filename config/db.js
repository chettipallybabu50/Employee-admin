// import dotenv from "dotenv";
import mysql from "mysql2/promise";
// dotenv.config();

// console.log("DB_HOST:", process.env.DB_HOST);
// console.log("DB_USER:", process.env.DB_USER);
// console.log("DB_PASS:", process.env.DB_PASSWORD ? "********" : "Not Set"); // Hide password for security
// console.log("DB_SCHEMA:", process.env.DB_DATABASE);


const db = mysql.createPool({
//   host: process.env.DB_HOST,          
//   user: process.env.DB_USER,           
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
 
  host:'localhost',
  user: 'root',
password:'root',
database:'testdb',

});

async function checkConnection() {
  try {
    const connection = await db.getConnection();
    console.log(' MySQL Database Connected Successfully!');
    // const [rows] = await connection.query("SELECT * FROM student");
    // console.log("the student data ",rows)
    connection.release(); // Release the connection
  } catch (error) {
    console.error(' MySQL Connection Failed:', error);
  }
}

// Run the connection check
checkConnection();

export default db;
