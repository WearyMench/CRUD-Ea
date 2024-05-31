import { createConnection } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const { HOST, DBPORT, DATABASE, USER, PASSWORD } = process.env;

if (!HOST || !DBPORT || !DATABASE || !USER || !PASSWORD) {
  throw new Error("Missing required database environment variables");
}
export const getConnection = async () => {
  try {
    const connection = await createConnection({
      host: HOST,
      port: DBPORT,
      database: DATABASE,
      user: USER,
      password: PASSWORD,
    });
    console.log("Connected to the database.");
    return connection;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
};
