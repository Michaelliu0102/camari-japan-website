import type { Locale } from "./locales";

export const CONTACT_INQUIRY_RECIPIENTS = {
  en: "info@camari-international.co.jp",
  ja: "info@camari-international.co.jp"
} satisfies Record<Locale, string>;

export type ContactInquiry = {
  locale: Locale;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  interests: string[];
  article?: string;
  pageUrl?: string;
};

type ParseResult =
  | { ok: true; value: ContactInquiry }
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

  return {
    ok: true,
    value: {
      locale,
      name,
      email,
      phone,
      company,
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
    `Interest: ${interestText}`,
    ...(inquiry.article ? [`Article: ${inquiry.article}`] : []),
    ...(inquiry.pageUrl ? [`Page URL: ${inquiry.pageUrl}`] : []),
    "",
    "Message / Project Specs:",
    inquiry.message
  ].join("\n");
}
