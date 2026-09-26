import { logoutAction, requireCompleteProfile } from "@/app/actions/auth";

export default async function DashboardPage() {
  const employee = await requireCompleteProfile();

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-6 bg-[#eef1f3] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        {employee.profilePicUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={employee.profilePicUrl}
            alt={employee.storeManagerName || employee.name}
            className="mx-auto size-20 rounded-full object-cover ring-2 ring-brand-green/20"
          />
        )}
        <h1 className="mt-4 text-center font-[family-name:var(--font-outfit)] text-2xl font-bold text-brand-green">
          Welcome, {employee.storeManagerName || employee.name}
        </h1>
        <p className="mt-2 text-center text-sm text-muted">
          {employee.store}
        </p>
        <p className="mt-1 text-center text-xs text-muted">
          Employee ID: {employee.employeeId}
        </p>
        <form action={logoutAction} className="mt-8">
          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center rounded-xl bg-brand-green font-semibold text-white transition hover:bg-brand-green-dark"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
