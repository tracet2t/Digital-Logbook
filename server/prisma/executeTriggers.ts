import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pg;

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to triggers.sql
const filePath = path.join(__dirname, "scripts", "triggers.sql");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function executeTriggers() {
  try {
    await client.connect();
    console.log(" Connected to the database.");

    // Ensure triggers.sql exists
    if (!fs.existsSync(filePath)) {
      throw new Error(` triggers.sql file not found at: ${filePath}`);
    }

    const sql = fs.readFileSync(filePath, "utf8");

    console.log(" Executing triggers.sql...");
    await client.query(sql);
    console.log(" Triggers executed successfully.");
  } catch (error) {
    console.error(" Error executing triggers.sql:", error);
  } finally {
    await client.end();
    console.log(" Database connection closed.");
  }
}

executeTriggers();
