"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { NEWSLETTER_SOURCE, isValidNewsletterEmail, normalizeNewsletterEmail } from "@/lib/newsletter";
import type { Locale } from "@/lib/locales";

type FooterNewsletterFormProps = {
  className?: string;
  layout?: "stacked" | "inline";
  locale: Locale;
};

type FormStatus = "idle" | "submitting" | "success" | "error";

const copy = {
  en: {
    label: "Subscribe to our newsletter",
    placeholder: "Email Address",
    invalid: "Enter a valid email address.",
    submitting: "Submitting...",
    success: "Thanks for subscribing.",
    error: "Subscription could not be completed. Please try again.",
    submitLabel: "Subscribe",
  },
  ja: {
    label: "ニュースレターを購読する",
    placeholder: "メールアドレス",
    invalid: "有効なメールアドレスを入力してください。",
    submitting: "送信中...",
    success: "ご登録ありがとうございます。",
    error: "登録に失敗しました。時間をおいて再度お試しください。",
    submitLabel: "登録する",
  },
} satisfies Record<
  Locale,
  {
    label: string;
    placeholder: string;
    invalid: string;
    submitting: string;
    success: string;
    error: string;
    submitLabel: string;
  }
>;

export function FooterNewsletterForm({ className = "", layout = "stacked", locale }: FooterNewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const labels = copy[locale];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = normalizeNewsletterEmail(email);
    if (!isValidNewsletterEmail(normalizedEmail)) {
      setStatus("error");
      setMessage(labels.invalid);
      return;
    }

    setStatus("submitting");
    setMessage(labels.submitting);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          locale,
          source: NEWSLETTER_SOURCE,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        setStatus("error");
        setMessage(labels.error);
        return;
      }

      setEmail("");
      setStatus("success");
      setMessage(labels.success);
    } catch {
      setStatus("error");
      setMessage(labels.error);
    }
  }

  function handleEmailChange(nextEmail: string) {
    setEmail(nextEmail);
    if (status !== "idle") {
      setStatus("idle");
      setMessage("");
    }
  }

  const feedbackClassName =
    status === "error"
      ? "text-[#8B3A3A]"
      : status === "success"
        ? "text-[#7A6A3A]"
        : "text-muted";

  const isInline = layout === "inline";

  return (
    <form className={`sm:col-span-2 ${isInline ? "items-end gap-8 lg:flex" : ""} ${className}`.trim()} onSubmit={handleSubmit}>
      <label className={`label-caps shrink-0 text-muted ${isInline ? "lg:pb-3" : ""}`} htmlFor="footer-email">
        {labels.label}
      </label>
      <div className={`${isInline ? "mt-5 lg:mt-0 lg:min-w-[22rem] lg:flex-1" : "mt-5"} flex border-b border-charcoal/20 pb-3`}>
        <input
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-70"
          disabled={status === "submitting"}
          id="footer-email"
          onChange={(event) => handleEmailChange(event.target.value)}
          placeholder={labels.placeholder}
          type="email"
          value={email}
        />
        <button
          aria-label={labels.submitLabel}
          className="flex h-8 w-8 items-center justify-center text-charcoal disabled:cursor-not-allowed disabled:opacity-50"
          disabled={status === "submitting"}
          type="submit"
        >
          <ArrowRight size={16} strokeWidth={1.4} />
        </button>
      </div>
      <p aria-live="polite" className={`${message ? "mt-3 min-h-[1.25rem]" : "h-0 overflow-hidden"} text-xs ${feedbackClassName}`}>
        {message}
      </p>
    </form>
  );
}
