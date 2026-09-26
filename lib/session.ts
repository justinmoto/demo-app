import { cookies } from "next/headers";
import type { SessionUser } from "./types";

const SESSION_COOKIE = "m2s_session";
const REMEMBER_ID_COOKIE = "m2s_remember_id";
const DAY = 60 * 60 * 24;

export async function createSession(
  user: SessionUser,
  remember: boolean,
): Promise<void> {
  const store = await cookies();
  store.set(
    SESSION_COOKIE,
    JSON.stringify({ ...user, remember }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: remember ? DAY * 30 : DAY,
    },
  );

  if (remember) {
    store.set(REMEMBER_ID_COOKIE, user.employeeId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: DAY * 30,
    });
  } else {
    store.delete(REMEMBER_ID_COOKIE);
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as SessionUser;
    return {
      ...parsed,
      remember: Boolean(parsed.remember),
    };
  } catch {
    return null;
  }
}

export async function getRememberedEmployeeId(): Promise<string | null> {
  const store = await cookies();
  return store.get(REMEMBER_ID_COOKIE)?.value ?? null;
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
