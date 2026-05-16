export const NEWSLETTER_SOURCE = "footer_newsletter" as const;

export type NewsletterLocale = "en" | "ja";
export type NewsletterSource = typeof NEWSLETTER_SOURCE;

export type NewsletterSubmission = {
  email: string;
  locale: NewsletterLocale;
  source: NewsletterSource;
  submittedAt: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeNewsletterEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidNewsletterEmail(email: string): boolean {
  return emailPattern.test(normalizeNewsletterEmail(email));
}

function isNewsletterLocale(value: unknown): value is NewsletterLocale {
  return value === "en" || value === "ja";
}

function isNewsletterSource(value: unknown): value is NewsletterSource {
  return value === NEWSLETTER_SOURCE;
}

function isValidSubmittedAt(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

export function parseNewsletterSubscriptionPayload(
  input: unknown,
): { ok: true; value: NewsletterSubmission } | { ok: false; error: string } {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Invalid newsletter payload." };
  }

  const payload = input as Partial<NewsletterSubmission>;
  const email = typeof payload.email === "string" ? normalizeNewsletterEmail(payload.email) : "";

  if (!email) {
    return { ok: false, error: "Email is required." };
  }

  if (!isValidNewsletterEmail(email)) {
    return { ok: false, error: "Email address is invalid." };
  }

  if (!isNewsletterLocale(payload.locale)) {
    return { ok: false, error: "Locale must be en or ja." };
  }

  if (!isNewsletterSource(payload.source)) {
    return { ok: false, error: "Newsletter source is invalid." };
  }

  if (!isValidSubmittedAt(payload.submittedAt)) {
    return { ok: false, error: "submittedAt must be a valid ISO date string." };
  }

  return {
    ok: true,
    value: {
      email,
      locale: payload.locale,
      source: payload.source,
      submittedAt: payload.submittedAt,
    },
  };
}
