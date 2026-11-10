"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseBackGracePeriodOptions {
  wasBackNavigated: boolean;
  clearBackNavigated: () => void;
  activeField?: string | null;
}

export function useBackGracePeriod({
  wasBackNavigated,
  clearBackNavigated,
  activeField = null,
}: UseBackGracePeriodOptions) {
  const [isGracePeriodActive, setIsGracePeriodActive] = useState<boolean>(wasBackNavigated);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30);
  const userEditingRef = useRef<boolean>(false);

  // Initialize 30-second grace period on Back navigation
  useEffect(() => {
    if (wasBackNavigated) {
      setIsGracePeriodActive(true);
      setSecondsRemaining(30);
      userEditingRef.current = false;

      const interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsGracePeriodActive(false);
            clearBackNavigated();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [wasBackNavigated, clearBackNavigated]);

  // Track active input focus during grace period
  useEffect(() => {
    if (isGracePeriodActive && activeField !== null) {
      userEditingRef.current = true;
    }
  }, [isGracePeriodActive, activeField]);

  // When field loses focus (activeField becomes null) after user started editing, lift grace period immediately
  useEffect(() => {
    if (isGracePeriodActive && userEditingRef.current && activeField === null) {
      setIsGracePeriodActive(false);
      clearBackNavigated();
    }
  }, [isGracePeriodActive, activeField, clearBackNavigated]);

  // Helper method for manual action triggers (e.g. option clicks or dropdown changes)
  const completeGracePeriodEarly = useCallback(() => {
    setIsGracePeriodActive(false);
    clearBackNavigated();
  }, [clearBackNavigated]);

  // Helper method to mark user actively started editing
  const markEditingStarted = useCallback(() => {
    if (isGracePeriodActive) {
      userEditingRef.current = true;
    }
  }, [isGracePeriodActive]);

  return {
    isGracePeriodActive,
    secondsRemaining,
    completeGracePeriodEarly,
    markEditingStarted,
  };
}
