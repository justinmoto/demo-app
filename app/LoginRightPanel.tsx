"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions/auth";
import type { LoginResult } from "@/lib/types";

const initialState: LoginResult | null = null;
const REMEMBER_KEY = "m2s_remember_employee_id";

type Props = {
  rememberedEmployeeId?: string | null;
};

export default function LoginRightPanel({ rememberedEmployeeId }: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [employeeId, setEmployeeId] = useState(rememberedEmployeeId ?? "");
  const [remember, setRemember] = useState(Boolean(rememberedEmployeeId));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (rememberedEmployeeId) {
      setEmployeeId(rememberedEmployeeId);
      setRemember(true);
      return;
    }
    const saved = localStorage.getItem(REMEMBER_KEY);
    if (saved) {
      setEmployeeId(saved);
      setRemember(true);
    }
  }, [rememberedEmployeeId]);

  useEffect(() => {
    if (pending) setLoading(true);
  }, [pending]);

  useEffect(() => {
    if (!state) return;

    if (!state.ok) {
      setLoading(false);
      return;
    }

    if (state.remember) {
      localStorage.setItem(REMEMBER_KEY, state.employeeId);
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }

    router.push(state.needsOnboarding ? "/onboarding" : "/dashboard");
  }, [state, router]);

  const busy = loading || pending;

  return (
    <section className="relative flex flex-col justify-center overflow-hidden px-6 py-10 sm:px-10 sm:py-14 lg:px-12">
      <div className="mx-auto w-full max-w-md">
        <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-bold tracking-tight text-[#0f2a1f] sm:text-[1.7rem]">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Access your account to manage your canteen, orders, and more.
        </p>

        <form
          action={formAction}
          onSubmit={() => setLoading(true)}
          className="mt-8 flex flex-col gap-5"
        >
          {state && !state.ok && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {state.error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="employeeId"
              className="text-sm font-semibold text-[#0f2a1f]"
            >
              Employee ID
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-brand-green-mid">
                <UserIcon />
              </span>
              <input
                id="employeeId"
                name="employeeId"
                type="text"
                autoComplete="username"
                placeholder="Enter your employee ID"
                required
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                disabled={busy}
                className="h-12 w-full rounded-xl border border-border bg-input-bg pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-brand-green-mid focus:bg-white focus:ring-2 focus:ring-brand-green/15 disabled:opacity-60"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-[#0f2a1f]"
            >
              Password
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-brand-green-mid">
                <LockIcon />
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                required
                disabled={busy}
                className="h-12 w-full rounded-xl border border-border bg-input-bg pl-11 pr-12 text-sm text-foreground outline-none transition focus:border-brand-green-mid focus:bg-white focus:ring-2 focus:ring-brand-green/15 disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-2 flex items-center rounded-lg px-2 text-muted transition hover:text-brand-green"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                name="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={busy}
                className="size-4 rounded border-border accent-brand-green"
              />
              Remember me
            </label>
            <a
              href="#"
              className="text-sm font-semibold text-brand-green-mid transition hover:text-brand-green"
            >
              Forgot password?
            </a>
          </div>

          <SignInButton busy={busy} />

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium text-muted">OR</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <a
            href="/register"
            className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-brand-green bg-white font-semibold text-brand-green transition hover:bg-brand-green-soft/50 ${
              busy ? "pointer-events-none opacity-60" : ""
            }`}
          >
            <UserPlusIcon />
            Create an account
          </a>
        </form>

        <p className="mt-10 text-center text-[11px] text-muted/80">
          © 2025 M2S × 7-Eleven Philippines. All rights reserved.
        </p>
      </div>
    </section>
  );
}

function SignInButton({ busy }: { busy: boolean }) {
  const { pending } = useFormStatus();
  const loading = busy || pending;

  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-green font-semibold text-white shadow-sm transition hover:bg-brand-green-dark active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? (
        <>
          <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          Signing in...
        </>
      ) : (
        <>
          Sign In
          <ArrowIcon />
        </>
      )}
    </button>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4.5 20.2c1.7-3.2 4.4-4.8 7.5-4.8s5.8 1.6 7.5 4.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8 10V7.5a4 4 0 0 1 8 0V10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 3l18 18M10.5 10.6a2.5 2.5 0 0 0 3 3M7.1 7.4C4.6 9 3 12 3 12s3.5 7 9 7c1.7 0 3.2-.5 4.5-1.2M16.9 15.1C19.2 13.5 21 12 21 12s-3.5-7-9-7c-.7 0-1.4.1-2 .2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserPlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 19c0-2.8-2.5-5-5.5-5S4 16.2 4 19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="9.5" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M18 8v6M15 11h6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
