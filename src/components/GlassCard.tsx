import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function GlassCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-xl",
        "p-6 sm:p-8",
        className
      )}
    >
      {children}
    </div>
  );
}
