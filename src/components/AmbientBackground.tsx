"use client";

import React from "react";
import { motion } from "framer-motion";

export const AmbientBackground: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-white">
      {/* Soft Drifting Blobs */}
      <motion.div
        className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl"
        animate={{
          x: [0, 40, -20, 0],
          y: [0, 30, 10, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 -right-32 h-96 w-96 rounded-full bg-emerald-100/30 blur-3xl"
        animate={{
          x: [0, -40, 20, 0],
          y: [0, -30, -10, 0],
          scale: [1, 1.05, 0.9, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-cyan-100/20 blur-3xl"
        animate={{
          x: [0, 30, -30, 0],
          y: [0, -20, 20, 0],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Faint Medical Cross Shapes */}
      <div className="absolute inset-0 opacity-[0.035] select-none">
        <svg className="h-full w-full" width="100%" height="100%">
          <pattern id="medical-cross-pattern" width="120" height="120" patternUnits="userSpaceOnUse">
            <g fill="#0141AB">
              <rect x="50" y="35" width="20" height="50" rx="3" />
              <rect x="35" y="50" width="50" height="20" rx="3" />
            </g>
          </pattern>
          <rect width="100%" height="100%" fill="url(#medical-cross-pattern)" />
        </svg>
      </div>

      {/* Floating Low-Opacity ECG Line Streamer */}
      <div className="absolute bottom-12 left-0 right-0 h-24 opacity-[0.08] select-none overflow-hidden">
        <motion.div
          className="flex w-[200%]"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          <svg className="h-full w-1/2" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <path
              d="M 0 50 L 200 50 L 220 20 L 235 90 L 250 10 L 270 70 L 285 50 L 450 50 L 470 20 L 485 90 L 500 10 L 520 70 L 535 50 L 1000 50"
              fill="none"
              stroke="#0141AB"
              strokeWidth="4"
            />
          </svg>
          <svg className="h-full w-1/2" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <path
              d="M 0 50 L 200 50 L 220 20 L 235 90 L 250 10 L 270 70 L 285 50 L 450 50 L 470 20 L 485 90 L 500 10 L 520 70 L 535 50 L 1000 50"
              fill="none"
              stroke="#0141AB"
              strokeWidth="4"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};
