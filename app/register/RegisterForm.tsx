"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { registerAction } from "@/app/actions/auth";
import type { RegisterResult } from "@/lib/types";

const initialState: RegisterResult | null = null;

export default function RegisterForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    registerAction,
    initialState,
  );
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!state?.ok) return;
    router.push("/onboarding");
  }, [state, router]);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state && !state.ok && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="employeeId" className="text-sm font-semibold text-[#0f2a1f]">
          Employee ID
        </label>
        <input
          id="employeeId"
          name="employeeId"
          type="text"
          placeholder="e.g. EMP004"
          required
          disabled={pending}
          className="h-12 w-full rounded-xl border border-border bg-input-bg px-4 text-sm outline-none transition focus:border-brand-green-mid focus:bg-white focus:ring-2 focus:ring-brand-green/15 disabled:opacity-60"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-semibold text-[#0f2a1f]">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Enter your full name"
          required
          disabled={pending}
          className="h-12 w-full rounded-xl border border-border bg-input-bg px-4 text-sm outline-none transition focus:border-brand-green-mid focus:bg-white focus:ring-2 focus:ring-brand-green/15 disabled:opacity-60"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-semibold text-[#0f2a1f]">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 6 characters"
            required
            minLength={6}
            disabled={pending}
            className="h-12 w-full rounded-xl border border-border bg-input-bg px-4 pr-12 text-sm outline-none transition focus:border-brand-green-mid focus:bg-white focus:ring-2 focus:ring-brand-green/15 disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-2 px-2 text-sm font-medium text-muted hover:text-brand-green"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-semibold text-[#0f2a1f]"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          placeholder="Re-enter password"
          required
          minLength={6}
          disabled={pending}
          className="h-12 w-full rounded-xl border border-border bg-input-bg px-4 text-sm outline-none transition focus:border-brand-green-mid focus:bg-white focus:ring-2 focus:ring-brand-green/15 disabled:opacity-60"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-green font-semibold text-white transition hover:bg-brand-green-dark disabled:opacity-70"
      >
        {pending ? (
          <>
            <Spinner />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </button>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <a href="/" className="font-semibold text-brand-green hover:underline">
          Sign in
        </a>
      </p>
    </form>
  );
}

function Spinner() {
  return (
    <svg
      className="size-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
