import { ObjectId } from "mongodb";
import type { Employee } from "./types";
import { getDb } from "./db";

type EmployeeDoc = {
  _id: ObjectId;
  employeeId: string;
  name: string;
  passwordHash: string;
  isActive?: boolean;
  profileComplete?: boolean;
  store?: string;
  storeManagerName?: string;
  profilePicUrl?: string;
};

function toEmployee(doc: EmployeeDoc): Employee {
  return {
    id: doc._id.toString(),
    employeeId: doc.employeeId,
    name: doc.name,
    passwordHash: doc.passwordHash,
    isActive: doc.isActive !== false,
    profileComplete: Boolean(doc.profileComplete),
    store: doc.store,
    storeManagerName: doc.storeManagerName,
    profilePicUrl: doc.profilePicUrl,
  };
}

export async function findEmployeeByEmployeeId(
  employeeId: string,
): Promise<Employee | null> {
  const db = await getDb();
  const doc = await db.collection<EmployeeDoc>("employees").findOne({
    employeeId,
  });
  return doc ? toEmployee(doc) : null;
}

export async function findEmployeeById(id: string): Promise<Employee | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db.collection<EmployeeDoc>("employees").findOne({
    _id: new ObjectId(id),
  });
  return doc ? toEmployee(doc) : null;
}

export async function completeEmployeeProfile(
  id: string,
  data: {
    store: string;
    storeManagerName: string;
    profilePicUrl: string;
  },
): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db.collection("employees").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        store: data.store,
        storeManagerName: data.storeManagerName,
        profilePicUrl: data.profilePicUrl,
        profileComplete: true,
        name: data.storeManagerName,
      },
    },
  );
  return result.matchedCount > 0;
}
