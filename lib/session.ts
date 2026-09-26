import { cookies } from "next/headers";
import type { SessionUser } from "./types";

const SESSION_COOKIE = "m2s_session";
const DAY = 60 * 60 * 24;

export async function createSession(
  user: SessionUser,
  remember: boolean,
): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: remember ? DAY * 30 : DAY,
  });
}

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
