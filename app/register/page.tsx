import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-[#eef1f3] px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-[0_25px_60px_-20px_rgba(0,40,25,0.28)]">
        <p className="text-xs font-bold tracking-[0.14em] text-brand-green-mid">
          M2S × 7-ELEVEN
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-outfit)] text-2xl font-bold text-brand-green">
          Create an account
        </h1>
        <p className="mt-2 text-sm text-muted">
          Register with your Employee ID. You&apos;ll set up your store profile
          after signing up.
        </p>
        <div className="mt-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
