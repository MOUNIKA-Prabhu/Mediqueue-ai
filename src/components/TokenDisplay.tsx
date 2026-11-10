export default function TokenDisplay({
  token,
  patientsAhead,
  label,
  aheadLabel,
}: {
  token: number;
  patientsAhead: number;
  label: string;
  aheadLabel: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-3xl bg-gradient-to-br from-brand-blue to-brand-blueDark p-10 text-white shadow-xl">
      <p className="text-kiosk-sm opacity-80">{label}</p>
      <p className="text-kiosk-2xl font-black tracking-wide">{token}</p>
      <div className="mt-2 rounded-full bg-white/15 px-5 py-2 text-kiosk-sm">
        {aheadLabel}: {patientsAhead}
      </div>
    </div>
  );
}
