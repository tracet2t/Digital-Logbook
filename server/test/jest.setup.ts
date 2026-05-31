import fs from "fs";
import path from "path";

import dotenv from "dotenv";

const rootDir = path.resolve(__dirname, "..");

const envFiles = [".env.test", ".env.example"];

for (const file of envFiles) {
  const fullPath = path.join(rootDir, file);
  if (fs.existsSync(fullPath)) {
    dotenv.config({ path: fullPath, override: false });
  }
}
