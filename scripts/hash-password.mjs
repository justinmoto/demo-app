import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const password = process.argv[2];

if (!password) {
  console.error("Usage: node scripts/hash-password.mjs <password>");
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const derived = await scryptAsync(password, salt, 64);
console.log(`${salt}:${derived.toString("hex")}`);
