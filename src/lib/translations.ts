import en from "@/constants/translations/en";
import ta from "@/constants/translations/ta";
import { Lang } from "@/types";

export const dictionaries = { en, ta };

export type TranslationKey = keyof typeof en;

export function t(lang: Lang, key: TranslationKey): string {
  const dict = dictionaries[lang] as Record<string, string>;
  return dict[key] ?? (en as Record<string, string>)[key] ?? key;
}
