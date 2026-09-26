"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { completeProfileAction } from "@/app/actions/auth";
import type { OnboardingResult } from "@/lib/types";

const initialState: OnboardingResult | null = null;

export default function OnboardingForm() {
  const [state, formAction, pending] = useActionState(
    completeProfileAction,
    initialState,
  );
  const [preview, setPreview] = useState<string | null>(null);

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

      <div className="flex flex-col items-center gap-3">
        <label className="relative cursor-pointer">
          <span className="flex size-28 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-brand-green/40 bg-brand-green-soft">
            {preview ? (
              <Image
                src={preview}
                alt="Store manager preview"
                width={112}
                height={112}
                className="size-full object-cover"
                unoptimized
              />
            ) : (
              <span className="px-3 text-center text-xs font-medium text-brand-green">
                Upload SM photo
              </span>
            )}
          </span>
          <input
            type="file"
            name="profilePic"
            accept="image/png,image/jpeg,image/webp"
            disabled={pending}
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) {
                setPreview(null);
                return;
              }
              setPreview(URL.createObjectURL(file));
            }}
          />
        </label>
        <p className="text-xs text-muted">Store Manager profile picture (optional)</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="store" className="text-sm font-semibold text-[#0f2a1f]">
          Store
        </label>
        <input
          id="store"
          name="store"
          type="text"
          placeholder="Store 546-Bicutan 7-11"
          required
          disabled={pending}
          className="h-12 w-full rounded-xl border border-border bg-input-bg px-4 text-sm outline-none transition focus:border-brand-green-mid focus:bg-white focus:ring-2 focus:ring-brand-green/15 disabled:opacity-60"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="storeManagerName"
          className="text-sm font-semibold text-[#0f2a1f]"
        >
          Store Manager Name
        </label>
        <input
          id="storeManagerName"
          name="storeManagerName"
          type="text"
          placeholder="Enter store manager name"
          required
          disabled={pending}
          className="h-12 w-full rounded-xl border border-border bg-input-bg px-4 text-sm outline-none transition focus:border-brand-green-mid focus:bg-white focus:ring-2 focus:ring-brand-green/15 disabled:opacity-60"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-green font-semibold text-white transition hover:bg-brand-green-dark disabled:opacity-70"
      >
        {pending ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Saving...
          </>
        ) : (
          "Continue"
        )}
      </button>
    </form>
  );
}
