import type { Locale } from "./locales";
import {
  getCountryRegionName,
  isCountryRegionCode,
  type CountryRegionCode
} from "./country-regions";

export const CONTACT_INQUIRY_RECIPIENTS = {
  en: "info@camari-international.co.jp",
  ja: "info@camari-international.co.jp"
} satisfies Record<Locale, string>;

export type ContactInquiryDraft = {
  locale: Locale;
  name: string;
  email: string;
  phone: string;
  company: string;
  countryCode: CountryRegionCode;
  countryRegion: string;
  message: string;
  interests: string[];
  article?: string;
  pageUrl?: string;
};

export type ContactInquiry = ContactInquiryDraft & {
  submissionId: string;
  submittedAt: string;
};

type ParseResult =
  | { ok: true; value: ContactInquiryDraft }
  | { ok: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isLocale(value: string): value is Locale {
  return value === "en" || value === "ja";
}

function isValidBusinessEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function parseContactInquiryPayload(payload: unknown): ParseResult {
  if (!isRecord(payload)) {
    return { ok: false, error: "Invalid inquiry payload." };
  }

  const localeValue = readString(payload.locale);
  const locale: Locale = isLocale(localeValue) ? localeValue : "en";
  const name = readString(payload.name);
  const email = readString(payload.email).toLowerCase();
  const phone = readString(payload.phone);
  const company = readString(payload.company);
  const requestedCountryCode = readString(payload.countryCode).toUpperCase();
  const countryCode = locale === "ja" ? "JP" : requestedCountryCode;
  const message = readString(payload.message);
  const article = readString(payload.article);
  const pageUrl = readString(payload.pageUrl);
  const interests = Array.isArray(payload.interests)
    ? payload.interests.map(readString).filter(Boolean).slice(0, 6)
    : [];

  if (!name || !email || !company || !message) {
    return { ok: false, error: "Name, business email, company name, and message are required." };
  }

  if (!isValidBusinessEmail(email)) {
    return { ok: false, error: "Please enter a valid business email address." };
  }

  if (!isCountryRegionCode(countryCode)) {
    return { ok: false, error: "Please select a valid country or region." };
  }

  return {
    ok: true,
    value: {
      locale,
      name,
      email,
      phone,
      company,
      countryCode,
      countryRegion: getCountryRegionName(countryCode),
      message,
      interests,
      ...(article ? { article } : {}),
      ...(pageUrl ? { pageUrl } : {})
    }
  };
}

export function buildContactInquiryText(inquiry: ContactInquiry, recipient: string): string {
  const interestText = inquiry.interests.length ? inquiry.interests.join(", ") : "Not specified";

  return [
    "New website inquiry",
    "",
    `Recipient: ${recipient}`,
    `Language: ${inquiry.locale}`,
    "",
    `Name: ${inquiry.name}`,
    `Business Email: ${inquiry.email}`,
    `Phone: ${inquiry.phone || "Not provided"}`,
    `Company Name: ${inquiry.company}`,
    `Country / Region: ${inquiry.countryRegion} (${inquiry.countryCode})`,
    `Interest: ${interestText}`,
    `Submission ID: ${inquiry.submissionId}`,
    `Submitted At: ${inquiry.submittedAt}`,
    ...(inquiry.article ? [`Article: ${inquiry.article}`] : []),
    ...(inquiry.pageUrl ? [`Page URL: ${inquiry.pageUrl}`] : []),
    "",
    "Message / Project Specs:",
    inquiry.message
  ].join("\n");
}
