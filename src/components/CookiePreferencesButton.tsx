"use client";

import { chineseCopy } from "../china/copy";
import { useConsent } from "@/components/ConsentManager";
import type { Locale } from "@/lib/locales";

export function CookiePreferencesButton({ locale }: { locale: Locale }) {
  const { openPreferences } = useConsent();

  return (
    <button className="uppercase transition-colors hover:text-gold" onClick={openPreferences} type="button">
      {locale === "zh" ? chineseCopy("COOKIE PREFERENCES") : locale === "en" ? "COOKIE PREFERENCES" : "COOKIE 設定"}
    </button>
  );
}
