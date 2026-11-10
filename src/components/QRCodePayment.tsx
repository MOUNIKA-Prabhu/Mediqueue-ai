"use client";

interface Props {
  qrDataUrl: string;
  amount: number;
  label: string;
}

export default function QRCodePayment({ qrDataUrl, amount, label }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-6 shadow-lg">
      <p className="text-kiosk-sm font-medium text-slate-600">{label}</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={qrDataUrl} alt="UPI QR Code" className="h-56 w-56 rounded-xl border" />
      <p className="text-kiosk-lg font-bold text-brand-blue">₹{amount}</p>
    </div>
  );
}
