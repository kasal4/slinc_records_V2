import { cookies } from "next/headers";
import { cs, en, type Messages } from "@/lib/messages";

export const LOCALES = ["cs", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const LOCALE_COOKIE = "slinc_locale";

export function isLocale(value: string | undefined): value is Locale {
  return value === "cs" || value === "en";
}

export function getLocale(): Locale {
  const value = cookies().get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : "cs";
}

export function t(): Messages {
  return getLocale() === "en" ? en : cs;
}

export function interpolate(template: string, values: Record<string, string>) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template,
  );
}
