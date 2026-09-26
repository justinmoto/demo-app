"use server";

import { redirect } from "next/navigation";
import {
  completeEmployeeProfile,
  createEmployee,
  findEmployeeByEmployeeId,
  findEmployeeById,
} from "@/lib/employees";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createSession, destroySession, getSession } from "@/lib/session";
import type { LoginResult, OnboardingResult, RegisterResult } from "@/lib/types";

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
      remember,
    },
    remember,
  );

  return {
    ok: true,
    needsOnboarding: !employee.profileComplete,
    employeeId: employee.employeeId,
    remember,
  };
}

export async function registerAction(
  _prev: RegisterResult | null,
  formData: FormData,
): Promise<RegisterResult> {
  const employeeId = String(formData.get("employeeId") ?? "").trim().toUpperCase();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!employeeId || !name || !password) {
    return { ok: false, error: "All fields are required." };
  }

  if (employeeId.length < 3) {
    return { ok: false, error: "Employee ID must be at least 3 characters." };
  }

  if (password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." };
  }

  if (password !== confirmPassword) {
    return { ok: false, error: "Passwords do not match." };
  }

  const passwordHash = await hashPassword(password);
  const employee = await createEmployee({ employeeId, name, passwordHash });

  if (!employee) {
    return { ok: false, error: "Employee ID is already taken." };
  }

  await createSession(
    {
      id: employee.id,
      employeeId: employee.employeeId,
      name: employee.name,
      profileComplete: false,
      remember: true,
    },
    true,
  );

  return { ok: true, needsOnboarding: true };
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

  let profilePicUrl: string | undefined;

  if (photo instanceof File && photo.size > 0) {
    if (!photo.type.startsWith("image/")) {
      return { ok: false, error: "Profile picture must be an image file." };
    }

    if (photo.size > 5 * 1024 * 1024) {
      return { ok: false, error: "Image must be under 5MB." };
    }

    const bytes = Buffer.from(await photo.arrayBuffer());
    profilePicUrl = `data:${photo.type};base64,${bytes.toString("base64")}`;
  }

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
      remember: session.remember,
    },
    session.remember,
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
