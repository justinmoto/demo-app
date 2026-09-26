import Image from "next/image";
import LoginRightPanel from "./LoginRightPanel";

const features = [
  {
    title: "Secure Login",
    desc: "Your data is safe with us.",
    icon: ShieldIcon,
    solid: true,
  },
  {
    title: "Fast Access",
    desc: "Get things done quickly.",
    icon: BoltIcon,
    solid: false,
  },
  {
    title: "Reliable System",
    desc: "Always available when you need it.",
    icon: CheckIcon,
    solid: false,
  },
];

const offices = [
  { city: "PARAÑAQUE", label: "Office" },
  { city: "DASMA", label: "Office" },
  { city: "IMUS", label: "Office" },
];

export default function Home() {
  return (
    <div className="relative flex min-h-full flex-1 items-center justify-center overflow-hidden bg-[#eef1f3] px-4 py-8 sm:px-6 lg:px-8">
      <div className="animate-fade-in relative z-10 grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-[0_25px_60px_-20px_rgba(0,40,25,0.28)] lg:grid-cols-[1.4fr_0.95fr]">
        <aside className="relative flex min-h-[480px] flex-col overflow-hidden lg:min-h-[660px]">
          <Image
            src="/68451516-6b81-48b6-9c83-b6e2841adc57.jpg"
            alt="M2S facility building"
            fill
            priority
            className="object-cover object-[center_30%]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/45 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/55 to-transparent" />

          <div className="relative z-10 flex h-full flex-col px-5 pb-0 pt-6 sm:px-7 sm:pt-8">
            {/* Header logos */}
            <div className="animate-fade-up flex flex-col items-start">
              <div className="flex items-center gap-3 sm:gap-4">
                <M2SLogo />
                <div className="flex h-12 flex-col items-center justify-center gap-1 sm:h-14">
                  <span className="w-px flex-1 bg-[#1a3d2e]/40" />
                  <span className="text-[11px] font-medium leading-none text-[#1a3d2e]/55">
                    ×
                  </span>
                  <span className="w-px flex-1 bg-[#1a3d2e]/40" />
                </div>
                <SevenElevenLogo />
              </div>
              <p className="mt-2.5 text-[10px] font-bold tracking-[0.12em] text-brand-green-mid sm:text-[11px]">
                OFFICIAL SERVICE PROVIDER OF 7-ELEVEN PHILIPPINES
              </p>
            </div>

            {/* Welcome */}
            <div
              className="animate-fade-up mt-8 sm:mt-10"
              style={{ animationDelay: "100ms" }}
            >
              <h1 className="font-[family-name:var(--font-outfit)] text-[1.95rem] font-extrabold leading-[1.15] text-brand-green sm:text-[2.35rem]">
                Welcome Back!
                <br />
                Please Login
              </h1>
              <p className="mt-2.5 whitespace-nowrap text-[13px] leading-relaxed text-[#4a5c54] sm:text-[15px]">
                Access your account to manage your canteen, orders, and more.
              </p>
            </div>

            {/* Feature cards — icon left, text right */}
            <div
              className="animate-fade-up mt-6 grid grid-cols-1 gap-2.5 sm:mt-8 sm:grid-cols-3 sm:gap-3"
              style={{ animationDelay: "180ms" }}
            >
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-center gap-2.5 rounded-2xl bg-white px-3 py-2.5 shadow-[0_4px_14px_rgba(0,0,0,0.08)]"
                >
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full sm:size-11 ${
                      feature.solid
                        ? "bg-brand-green text-white"
                        : "bg-brand-green-soft text-brand-green"
                    }`}
                  >
                    <feature.icon />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold leading-tight text-[#0f2a1f] sm:text-[13px]">
                      {feature.title}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-snug text-muted sm:text-xs">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Offices footer */}
            <div
              className="animate-fade-up mt-auto bg-gradient-to-t from-black/70 via-black/40 to-transparent px-1 pb-4 pt-10"
              style={{ animationDelay: "260ms" }}
            >
              <p className="text-[11px] font-bold tracking-[0.16em] text-white sm:text-xs">
                OUR OFFICES
              </p>
              <div className="mt-2 h-px w-full bg-white/40" />
              <div className="mt-3 flex w-fit max-w-full items-stretch">
                {offices.map((office, i) => (
                  <div
                    key={office.city}
                    className={`flex items-center gap-2 ${
                      i > 0
                        ? "border-l border-white/40 pl-3 sm:pl-4"
                        : "pr-3 sm:pr-4"
                    } ${i < offices.length - 1 ? "pr-3 sm:pr-4" : ""}`}
                  >
                    <PinIcon />
                    <div className="leading-tight">
                      <p className="text-[11px] font-bold tracking-wide text-white sm:text-xs">
                        {office.city}
                      </p>
                      <p className="text-[10px] text-white/75 sm:text-[11px]">
                        {office.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <LoginRightPanel />
      </div>
    </div>
  );
}

function M2SLogo() {
  return (
    <div className="flex flex-col items-start leading-none">
      <p className="font-[family-name:var(--font-outfit)] text-[1.85rem] font-extrabold tracking-tight sm:text-[2.05rem]">
        <span className="text-brand-green">M</span>
        <span className="text-brand-red">2</span>
        <span className="text-brand-green">S</span>
      </p>
      <p className="mt-0.5 text-[8px] font-bold tracking-[0.08em] text-[#5a6b63] sm:text-[9px]">
        MALINIS MAINTENANCE SERVICES
      </p>
    </div>
  );
}

function SevenElevenLogo() {
  return (
    <Image
      src="/OIP.webp"
      alt="7-Eleven Philippines"
      width={120}
      height={72}
      className="h-12 w-auto object-contain sm:h-[3.25rem]"
      priority
    />
  );
}

function ShieldIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="block"
    >
      <path
        d="M12 2.5 4.5 6v6c0 4.8 3.1 8.7 7.5 10 4.4-1.3 7.5-5.2 7.5-10V6L12 2.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="block"
    >
      <path d="M13 2 5 13h6l-1 9 9-12h-6l0-8Z" fill="currentColor" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="block"
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path
        d="m8.2 12.2 2.6 2.6 5-5.2"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="mt-0.5 shrink-0"
    >
      <path
        d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z"
        fill="#3ecf8e"
      />
      <circle cx="12" cy="10" r="2.5" fill="#0a2e20" />
    </svg>
  );
}
