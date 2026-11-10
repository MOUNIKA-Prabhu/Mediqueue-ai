"use client";

import { useCallback, useRef } from "react";
import { Lang } from "@/types";

/**
 * Wraps the browser SpeechSynthesis API to announce kiosk events in the
 * currently selected language. Waiting time itself is calculated internally
 * (see lib/queue-logic.ts) and is only ever spoken, never shown on screen.
 */
export function useVoice(lang: Lang) {
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  const pickVoice = useCallback((): SpeechSynthesisVoice | undefined => {
    if (typeof window === "undefined" || !window.speechSynthesis) return undefined;
    voicesRef.current = window.speechSynthesis.getVoices();
    const wantedTag = lang === "ta" ? "ta" : "en";
    return (
      voicesRef.current.find((v) => v.lang.toLowerCase().startsWith(wantedTag)) ??
      voicesRef.current.find((v) => v.lang.toLowerCase().startsWith("en"))
    );
  }, [lang]);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = pickVoice();
      if (voice) utterance.voice = voice;
      utterance.lang = lang === "ta" ? "ta-IN" : "en-IN";
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    },
    [lang, pickVoice]
  );

  return { speak };
}

export function speechTemplates(lang: Lang) {
  return {
    welcome: () =>
      lang === "ta" ? "மெடிக்யூ மருத்துவமனைக்கு வரவேற்கிறோம்." : "Welcome to MediQueue Hospital.",
    registrationComplete: () =>
      lang === "ta" ? "பதிவு வெற்றிகரமாக முடிந்தது." : "Registration completed successfully.",
    doctorSelected: (name: string) =>
      lang === "ta" ? `நீங்கள் ${name} ஐ தேர்ந்தெடுத்துள்ளீர்கள்.` : `You have selected ${name}.`,
    token: (n: number) =>
      lang === "ta" ? `உங்கள் டோக்கன் எண் ${n}.` : `Your token number is ${n}.`,
    waitTime: (minutes: number) =>
      lang === "ta"
        ? `உங்கள் தோராயமான காத்திருப்பு நேரம் ${minutes} நிமிடங்கள்.`
        : `Your approximate waiting time is ${minutes} minutes.`,
    paymentSuccess: (amount: number) =>
      lang === "ta"
        ? `₹${amount} கட்டணம் வெற்றிகரமாக பெறப்பட்டது.`
        : `Payment of ₹${amount} received successfully.`,
    cashPending: () =>
      lang === "ta"
        ? "தயவுசெய்து வரவேற்பு கவுண்டரில் பணம் செலுத்தவும்."
        : "Please pay at the reception counter.",
    printing: () =>
      lang === "ta" ? "உங்கள் ரசீது அச்சிடப்படுகிறது." : "Printing your receipt.",
  };
}
