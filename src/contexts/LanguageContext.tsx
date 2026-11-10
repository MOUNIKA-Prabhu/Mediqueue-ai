"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Lang } from "@/types";
import { t as translate, TranslationKey } from "@/lib/translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("mq_lang", l);
    }
  };

  const t = (key: TranslationKey) => translate(lang, key);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Provide safe fallback for legacy routes during static prerendering
    return {
      lang: "en" as Lang,
      setLang: () => {},
      t: (key: TranslationKey) => translate("en", key),
    };
  }
  return ctx;
}
