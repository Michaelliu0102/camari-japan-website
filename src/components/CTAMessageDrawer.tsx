"use client";

import { X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import type { Locale } from "@/lib/locales";

type CTAMessageDrawerProps = {
  articleLabel?: string;
  buttonClassName: string;
  buttonLabel: string;
  locale: Locale;
  placement?: "bottom" | "top";
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  interests: string[];
};

const initialFormState: FormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  message: "",
  interests: []
};

const copy = {
  en: {
    title: "Write us a message.",
    intro: "Send us your material brief or custom project idea",
    name: "Name",
    namePlaceholder: "Name",
    email: "Business Email",
    emailPlaceholder: "name@company.com",
    phone: "Phone",
    phonePlaceholder: "Optional",
    company: "Company Name",
    companyPlaceholder: "Company Name",
    article: "Article",
    interests: "Interest",
    materials: "Material",
    customProducts: "Custom Projects",
    message: "Message / Project Specs",
    messagePlaceholder: "Tell us about your application, quantity, timeline, material direction, or technical requirements.",
    submit: "Submit",
    close: "Close message form",
    required: "Please enter your name, business email, company name, and project message.",
    sending: "Sending your inquiry...",
    success: "Thank you. Your inquiry has been sent.",
    error: "We could not send your inquiry. Please email info@camari-international.co.jp directly."
  },
  ja: {
    title: "Write us a message.",
    intro: "Send us your material brief or custom project idea",
    name: "Name",
    namePlaceholder: "Name",
    email: "Business Email",
    emailPlaceholder: "name@company.com",
    phone: "Phone",
    phonePlaceholder: "Optional",
    company: "Company Name",
    companyPlaceholder: "Company Name",
    article: "Article",
    interests: "Interest",
    materials: "Material",
    customProducts: "Custom Projects",
    message: "Message / Project Specs",
    messagePlaceholder: "用途、数量、納期、素材イメージ、技術要件などをご記入ください。",
    submit: "Submit",
    close: "Close message form",
    required: "お名前、Business Email、Company Name、Message / Project Specs を入力してください。",
    sending: "お問い合わせを送信しています...",
    success: "お問い合わせを送信しました。",
    error: "送信できませんでした。info@camari-international.co.jp まで直接お問い合わせください。"
  }
} satisfies Record<Locale, Record<string, string>>;

export function CTAMessageDrawer({ articleLabel, buttonClassName, buttonLabel, locale, placement = "bottom" }: CTAMessageDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleId = useId();
  const labels = copy[locale];
  const isTopPlacement = placement === "top";

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function updateField(field: keyof Omit<FormState, "interests">, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    if (feedback) setFeedback("");
  }

  function toggleInterest(interest: string) {
    setForm((current) => {
      const nextInterests = current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest];

      return { ...current, interests: nextInterests };
    });
    if (feedback) setFeedback("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.company.trim() || !form.message.trim()) {
      setFeedback(labels.required);
      return;
    }

    setIsSubmitting(true);
    setFeedback(labels.sending);

    try {
      const response = await fetch("/api/contact/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          ...form,
          ...(articleLabel ? { article: articleLabel } : {}),
          pageUrl: window.location.href
        })
      });

      if (!response.ok) {
        throw new Error("Contact inquiry delivery failed.");
      }

      setForm(initialFormState);
      setFeedback(labels.success);
    } catch {
      setFeedback(labels.error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button className={buttonClassName} onClick={() => setIsOpen(true)} type="button">
        {buttonLabel}
      </button>
      <div
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-[260] flex justify-center bg-charcoal/70 px-3 backdrop-blur-[8px] transition-opacity duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] md:px-6 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        } ${isTopPlacement ? "items-start pb-16 pt-3 md:pb-6 md:pt-6" : "items-end pb-3 pt-16 md:pb-6"}`}
        onClick={() => setIsOpen(false)}
      >
        <section
          aria-labelledby={titleId}
          aria-modal="true"
          className={`relative max-h-[92svh] w-full max-w-[54rem] overflow-y-auto border border-white/30 bg-stone px-5 pb-6 pt-6 text-left text-charcoal transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] md:rounded-[1.5rem] md:px-8 md:pb-8 md:pt-8 ${
            isTopPlacement ? "rounded-b-[1.5rem] shadow-[0_2rem_6rem_rgb(0_0_0_/_0.35)]" : "rounded-t-[1.5rem] shadow-[0_-2rem_6rem_rgb(0_0_0_/_0.35)]"
          } ${
            isOpen ? "translate-y-0" : isTopPlacement ? "-translate-y-[calc(100%+2rem)]" : "translate-y-full"
          }`}
          onClick={(event) => event.stopPropagation()}
          role="dialog"
        >
          <button
            aria-label={labels.close}
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-charcoal/15 text-charcoal/65 transition-colors hover:border-charcoal hover:text-charcoal"
            onClick={() => setIsOpen(false)}
            type="button"
          >
            <X size={17} strokeWidth={1.4} />
          </button>

          <div className="max-w-[34rem]">
            <h2 className="font-serif text-2xl leading-tight md:text-3xl" id={titleId}>
              {labels.title}
            </h2>
            <p className="mt-4 text-[15px] leading-[1.6] tracking-[0.02em] text-charcoal/65">{labels.intro}</p>
          </div>

          <form className="mt-8 grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
              <label className="grid gap-3">
                <span className="label-caps text-charcoal/70">{labels.name} <span className="text-gold">*</span></span>
                <input
                  className="border-b border-charcoal bg-transparent pb-4 text-[15px] outline-none transition-colors placeholder:text-charcoal/35 focus:border-charcoal"
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder={labels.namePlaceholder}
                  required
                  type="text"
                  value={form.name}
                />
              </label>
              <label className="grid gap-3">
                <span className="label-caps text-charcoal/70">{labels.email} <span className="text-gold">*</span></span>
                <input
                  className="border-b border-charcoal bg-transparent pb-4 text-[15px] outline-none transition-colors placeholder:text-charcoal/35 focus:border-charcoal"
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder={labels.emailPlaceholder}
                  required
                  type="email"
                  value={form.email}
                />
              </label>
              <label className="grid gap-3">
                <span className="label-caps text-charcoal/70">{labels.phone}</span>
                <input
                  className="border-b border-charcoal bg-transparent pb-4 text-[15px] outline-none transition-colors placeholder:text-charcoal/35 focus:border-charcoal"
                  onChange={(event) => updateField("phone", event.target.value)}
                  placeholder={labels.phonePlaceholder}
                  type="tel"
                  value={form.phone}
                />
              </label>
              <label className="grid gap-3">
                <span className="label-caps text-charcoal/70">{labels.company} <span className="text-gold">*</span></span>
                <input
                  className="border-b border-charcoal bg-transparent pb-4 text-[15px] outline-none transition-colors placeholder:text-charcoal/35 focus:border-charcoal"
                  onChange={(event) => updateField("company", event.target.value)}
                  placeholder={labels.companyPlaceholder}
                  required
                  type="text"
                  value={form.company}
                />
              </label>
            </div>

            {articleLabel ? (
              <div className="grid gap-3 pt-1">
                <span className="label-caps text-charcoal/70">{labels.article}</span>
                <div className="inline-flex min-h-[3rem] w-fit max-w-full items-center border border-charcoal px-5 py-3 font-sans text-[13px] tracking-[0.04em] text-charcoal">
                  {articleLabel}
                </div>
              </div>
            ) : (
              <fieldset className="flex flex-wrap items-center gap-4 pt-1">
                <legend className="sr-only">{labels.interests}</legend>
                {[labels.materials, labels.customProducts].map((interest) => {
                  const checked = form.interests.includes(interest);

                  return (
                    <label
                      className={`inline-flex cursor-pointer items-center gap-3 rounded-full border px-5 py-3 text-[11px] uppercase tracking-[0.18em] transition-colors ${
                        checked ? "border-charcoal bg-charcoal text-stone" : "border-charcoal text-charcoal/75 hover:border-charcoal"
                      }`}
                      key={interest}
                    >
                      <input
                        checked={checked}
                        className="sr-only"
                        onChange={() => toggleInterest(interest)}
                        type="checkbox"
                      />
                      <span aria-hidden="true" className={`grid h-4 w-4 place-items-center border text-[10px] leading-none ${checked ? "border-gold bg-gold text-charcoal" : "border-charcoal bg-stone text-transparent"}`}>
                        ✓
                      </span>
                      {interest}
                    </label>
                  );
                })}
              </fieldset>
            )}

            <label className="grid gap-3">
              <span className="label-caps text-charcoal/70">{labels.message} <span className="text-gold">*</span></span>
              <textarea
                className="min-h-[11rem] resize-y border border-charcoal bg-transparent p-5 text-[15px] leading-7 outline-none transition-colors placeholder:text-charcoal/35 focus:border-charcoal"
                onChange={(event) => updateField("message", event.target.value)}
                placeholder={labels.messagePlaceholder}
                required
                value={form.message}
              />
            </label>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <p aria-live="polite" className={`min-h-5 text-xs ${feedback === labels.required || feedback === labels.error ? "text-[#8B3A3A]" : "text-charcoal/50"}`}>
                {feedback}
              </p>
              <button className="label-caps inline-flex min-h-[3.75rem] items-center justify-center bg-charcoal px-8 text-stone transition-colors hover:bg-gold hover:text-charcoal disabled:cursor-not-allowed disabled:bg-charcoal/45 disabled:text-stone/70" disabled={isSubmitting} type="submit">
                {isSubmitting ? labels.sending : labels.submit}
              </button>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}
