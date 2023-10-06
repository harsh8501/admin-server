import mysql from "mysql";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, "..", ".env");

dotenv.config({ path: envPath });

const host = process.env.HOSTNAME;
const user = process.env.USER;
const password = process.env.PASSWORD;
const databaseName = process.env.DATABASE_NAME;

const conn = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  database: databaseName,
});

conn.connect((err) => {
  if (err) {
    console.warn("error:", err.message);
  } else {
    console.log("DB Connected");
  }
});

export default conn;
