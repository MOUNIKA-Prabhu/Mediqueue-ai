"use client";

import React, { useState } from "react";
import { Delete, Space, CheckCircle2 } from "lucide-react";

interface VirtualKeyboardProps {
  value?: string;
  onChange?: (val: string) => void;
  onClose?: () => void;
  fieldLabel?: string;
  onKey?: (c: string) => void;
  onBackspace?: () => void;
  onDone?: () => void;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  value = "",
  onChange,
  onClose,
  fieldLabel,
  onKey,
  onBackspace,
  onDone,
}) => {
  const [isNumericMode, setIsNumericMode] = useState(false);
  const [isShiftActive, setIsShiftActive] = useState(true);

  const qwertyRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  const numpadRows = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["@", "#", "$", "%", "&", "-", "+", "(", ")", "/"],
    [".", ",", "?", "!", ":", ";", "'", '"'],
  ];

  const handleKeyPress = (char: string) => {
    const finalChar = isShiftActive ? char.toUpperCase() : char.toLowerCase();
    if (onKey) {
      onKey(finalChar);
    }
    if (onChange) {
      onChange(value + finalChar);
    }
  };

  const handleBackspace = () => {
    if (onBackspace) {
      onBackspace();
    }
    if (onChange) {
      onChange(value.slice(0, -1));
    }
  };

  const handleSpace = () => {
    if (onKey) {
      onKey(" ");
    }
    if (onChange) {
      onChange(value + " ");
    }
  };

  const activeRows = isNumericMode ? numpadRows : qwertyRows;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-4xl mx-auto rounded-3xl bg-slate-900/95 p-4 md:p-6 shadow-2xl backdrop-blur-md select-none border border-slate-700"
    >
      {fieldLabel && (
        <div className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
          Entering: {fieldLabel}
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {activeRows.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1.5 md:gap-2">
            {row.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => handleKeyPress(key)}
                className="flex h-12 min-w-[36px] flex-1 items-center justify-center rounded-xl bg-slate-800 text-lg md:text-xl font-bold text-white shadow-md active:bg-[#0141AB] hover:bg-slate-700 transition-colors"
              >
                {isShiftActive ? key.toUpperCase() : key.toLowerCase()}
              </button>
            ))}
          </div>
        ))}

        {/* Bottom Function Row */}
        <div className="flex items-center justify-center gap-2 mt-1">
          {/* Mode Switch Button */}
          <button
            type="button"
            onClick={() => setIsNumericMode(!isNumericMode)}
            className="flex h-12 w-20 items-center justify-center rounded-xl bg-slate-700 text-sm font-black text-slate-200 shadow-md hover:bg-slate-600 active:scale-95"
          >
            {isNumericMode ? "ABC" : "123"}
          </button>

          {/* Shift Toggle */}
          {!isNumericMode && (
            <button
              type="button"
              onClick={() => setIsShiftActive(!isShiftActive)}
              className={`flex h-12 w-20 items-center justify-center rounded-xl text-sm font-black shadow-md transition-colors ${
                isShiftActive ? "bg-[#0141AB] text-white" : "bg-slate-700 text-slate-300"
              }`}
            >
              ⇧ SHIFT
            </button>
          )}

          {/* Space Bar */}
          <button
            type="button"
            onClick={handleSpace}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-800 text-base font-bold text-white shadow-md hover:bg-slate-700 active:bg-[#0141AB]"
          >
            <Space className="h-5 w-5" /> Space
          </button>

          {/* Backspace */}
          <button
            type="button"
            onClick={handleBackspace}
            className="flex h-12 w-24 items-center justify-center gap-1.5 rounded-xl bg-rose-600 text-sm font-bold text-white shadow-md hover:bg-rose-700 active:scale-95"
          >
            <Delete className="h-5 w-5" /> Delete
          </button>

          {/* Done Button if onDone or onClose provided */}
          {(onDone || onClose) && (
            <button
              type="button"
              onClick={onDone || onClose}
              className="flex h-12 w-20 items-center justify-center gap-1 rounded-xl bg-emerald-600 text-sm font-bold text-white shadow-md hover:bg-emerald-700 active:scale-95"
            >
              <CheckCircle2 className="h-4 w-4" /> OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VirtualKeyboard;
