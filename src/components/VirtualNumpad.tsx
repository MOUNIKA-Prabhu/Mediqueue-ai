"use client";

import React from "react";
import { Delete, CheckCircle2 } from "lucide-react";

interface VirtualNumpadProps {
  value: string;
  onChange: (val: string) => void;
  maxLength?: number;
  onDone?: () => void;
  onClose?: () => void;
}

export const VirtualNumpad: React.FC<VirtualNumpadProps> = ({
  value,
  onChange,
  maxLength,
  onDone,
  onClose,
}) => {
  const handleDigit = (digit: string) => {
    if (maxLength && value.length >= maxLength) return;
    onChange(value + digit);
  };

  const handleBackspace = () => {
    onChange(value.slice(0, -1));
  };

  const handleClear = () => {
    onChange("");
  };

  const handleDoneClick = onDone || onClose;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-sm mx-auto rounded-3xl bg-slate-900/95 p-5 shadow-2xl backdrop-blur-md select-none border border-slate-700"
    >
      <div className="grid grid-cols-3 gap-3">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => handleDigit(num)}
            className="flex h-16 items-center justify-center rounded-2xl bg-slate-800 text-2xl font-black text-white shadow-md hover:bg-slate-700 active:bg-[#0141AB] active:scale-95 transition-all"
          >
            {num}
          </button>
        ))}

        <button
          type="button"
          onClick={handleClear}
          className="flex h-16 items-center justify-center rounded-2xl bg-slate-700 text-sm font-black text-slate-300 shadow-md hover:bg-slate-600 active:scale-95"
        >
          CLEAR
        </button>

        <button
          type="button"
          onClick={() => handleDigit("0")}
          className="flex h-16 items-center justify-center rounded-2xl bg-slate-800 text-2xl font-black text-white shadow-md hover:bg-slate-700 active:bg-[#0141AB] active:scale-95 transition-all"
        >
          0
        </button>

        <button
          type="button"
          onClick={handleBackspace}
          className="flex h-16 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-md hover:bg-rose-700 active:scale-95"
        >
          <Delete className="h-7 w-7" />
        </button>
      </div>

      {handleDoneClick && (
        <button
          type="button"
          onClick={handleDoneClick}
          className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-sm font-bold text-white shadow-md hover:bg-emerald-700 active:scale-95 transition-all"
        >
          <CheckCircle2 className="h-5 w-5" /> DONE
        </button>
      )}
    </div>
  );
};

export default VirtualNumpad;
