export type Employee = {
  id: string;
  employeeId: string;
  name: string;
  passwordHash: string;
  isActive: boolean;
  profileComplete: boolean;
  store?: string;
  storeManagerName?: string;
  profilePicUrl?: string;
};

export type SessionUser = {
  id: string;
  employeeId: string;
  name: string;
  profileComplete: boolean;
};

export type LoginResult =
  | { ok: true; needsOnboarding: boolean }
  | { ok: false; error: string };

export type OnboardingResult =
  | { ok: true }
  | { ok: false; error: string };
