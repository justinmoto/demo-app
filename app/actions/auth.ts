"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { redirect } from "next/navigation";
import {
  completeEmployeeProfile,
  findEmployeeByEmployeeId,
  findEmployeeById,
} from "@/lib/employees";
import { verifyPassword } from "@/lib/password";
import { createSession, destroySession, getSession } from "@/lib/session";
import type { LoginResult, OnboardingResult } from "@/lib/types";

export async function loginAction(
  _prev: LoginResult | null,
  formData: FormData,
): Promise<LoginResult> {
  const employeeId = String(formData.get("employeeId") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const remember = formData.get("remember") === "on";

  if (!employeeId || !password) {
    return { ok: false, error: "Employee ID and password are required." };
  }

  const employee = await findEmployeeByEmployeeId(employeeId);

  if (!employee || !employee.isActive) {
    return { ok: false, error: "Invalid Employee ID or password." };
  }

  const valid = await verifyPassword(password, employee.passwordHash);
  if (!valid) {
    return { ok: false, error: "Invalid Employee ID or password." };
  }

  await createSession(
    {
      id: employee.id,
      employeeId: employee.employeeId,
      name: employee.name,
      profileComplete: employee.profileComplete,
    },
    remember,
  );

  return { ok: true, needsOnboarding: !employee.profileComplete };
}

export async function completeProfileAction(
  _prev: OnboardingResult | null,
  formData: FormData,
): Promise<OnboardingResult> {
  const session = await getSession();
  if (!session) {
    return { ok: false, error: "Please sign in again." };
  }

  const store = String(formData.get("store") ?? "").trim();
  const storeManagerName = String(formData.get("storeManagerName") ?? "").trim();
  const photo = formData.get("profilePic");

  if (!store || !storeManagerName) {
    return { ok: false, error: "Store and Store Manager Name are required." };
  }

  if (!(photo instanceof File) || photo.size === 0) {
    return { ok: false, error: "Please upload a store manager profile picture." };
  }

  if (!photo.type.startsWith("image/")) {
    return { ok: false, error: "Profile picture must be an image file." };
  }

  if (photo.size > 5 * 1024 * 1024) {
    return { ok: false, error: "Image must be under 5MB." };
  }

  const ext = photo.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "jpg";
  const fileName = `${session.employeeId}-${Date.now()}.${safeExt}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "profiles");
  await mkdir(uploadDir, { recursive: true });

  const bytes = Buffer.from(await photo.arrayBuffer());
  await writeFile(path.join(uploadDir, fileName), bytes);

  const profilePicUrl = `/uploads/profiles/${fileName}`;
  const updated = await completeEmployeeProfile(session.id, {
    store,
    storeManagerName,
    profilePicUrl,
  });

  if (!updated) {
    return { ok: false, error: "Could not save profile. Try again." };
  }

  await createSession(
    {
      id: session.id,
      employeeId: session.employeeId,
      name: storeManagerName,
      profileComplete: true,
    },
    true,
  );

  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}

export async function requireCompleteProfile() {
  const session = await getSession();
  if (!session) redirect("/");

  const employee = await findEmployeeById(session.id);
  if (!employee) {
    await destroySession();
    redirect("/");
  }

  if (!employee.profileComplete) redirect("/onboarding");
  return employee;
}
