import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { MongoClient } from "mongodb";

const scryptAsync = promisify(scrypt);

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i === -1) continue;
    const key = trimmed.slice(0, i).trim();
    let value = trimmed.slice(i + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = await scryptAsync(password, salt, 64);
  return `${salt}:${derived.toString("hex")}`;
}

const accounts = [
  {
    employeeId: "EMP001",
    name: "Juan Dela Cruz",
    password: "password123",
  },
  {
    employeeId: "EMP002",
    name: "Maria Santos",
    password: "password123",
  },
  {
    employeeId: "EMP003",
    name: "Pedro Reyes",
    password: "password123",
  },
  {
    employeeId: "EMP004",
    name: "Ana Villanueva",
    password: "password123",
  },
  {
    employeeId: "EMP005",
    name: "Carlo Mendoza",
    password: "password123",
  },
];

loadEnvLocal();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Missing MONGODB_URI. Set it in .env.local first.");
  process.exit(1);
}

const client = new MongoClient(uri);

try {
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || undefined);
  const employees = db.collection("employees");

  await employees.createIndex({ employeeId: 1 }, { unique: true });

  for (const account of accounts) {
    const passwordHash = await hashPassword(account.password);
    await employees.updateOne(
      { employeeId: account.employeeId },
      {
        $set: {
          name: account.name,
          passwordHash,
          isActive: true,
          profileComplete: false,
          store: null,
          storeManagerName: null,
          profilePicUrl: null,
        },
        $setOnInsert: { employeeId: account.employeeId },
      },
      { upsert: true },
    );
    console.log(`✓ ${account.employeeId} — ${account.name}`);
  }

  console.log("\nPremade accounts (password for all: password123)");
  for (const a of accounts) {
    console.log(`  ${a.employeeId}  ${a.name}`);
  }
} finally {
  await client.close();
}
