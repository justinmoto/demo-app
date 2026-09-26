import { redirect } from "next/navigation";
import OnboardingForm from "./OnboardingForm";
import { getSession } from "@/lib/session";
import { findEmployeeById } from "@/lib/employees";

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session) redirect("/");

  let employee;
  try {
    employee = await findEmployeeById(session.id);
  } catch {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center bg-[#eef1f3] px-4">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-brand-green">Connection error</h1>
          <p className="mt-2 text-sm text-muted">
            Could not reach the database. Check your MongoDB connection and try again.
          </p>
          <a
            href="/"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-brand-green px-5 font-semibold text-white"
          >
            Back to login
          </a>
        </div>
      </div>
    );
  }

  if (!employee) redirect("/");
  if (employee.profileComplete) redirect("/dashboard");

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-[#eef1f3] px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-[0_25px_60px_-20px_rgba(0,40,25,0.28)]">
        <p className="text-xs font-bold tracking-[0.14em] text-brand-green-mid">
          NEW ACCOUNT SETUP
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-outfit)] text-2xl font-bold text-brand-green">
          Complete your profile
        </h1>
        <p className="mt-2 text-sm text-muted">
          Fill in your store details and store manager information to continue.
        </p>
        <div className="mt-8">
          <OnboardingForm />
        </div>
      </div>
    </div>
  );
}
