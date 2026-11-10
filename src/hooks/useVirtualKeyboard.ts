"use client";

import { useState, useCallback } from "react";

export function useVirtualKeyboard() {
  const [activeField, setActiveField] = useState<string | null>(null);

  const open = useCallback((fieldName: string) => setActiveField(fieldName), []);
  const close = useCallback(() => setActiveField(null), []);

  return { activeField, open, close };
}
