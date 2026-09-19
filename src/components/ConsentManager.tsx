"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { localizedPath, type Locale } from "@/lib/locales";

const CONSENT_STORAGE_KEY = "camari-consent-v1";
const CONSENT_VERSION = 1;
const CONSENT_DURATION_MS = 1000 * 60 * 60 * 24 * 183;

type ConsentPreferences = {
  version: typeof CONSENT_VERSION;
  externalMedia: boolean;
  updatedAt: string;
  expiresAt: string;
};

type ConsentContextValue = {
  externalMediaAllowed: boolean;
  locale: Locale;
  grantExternalMedia: () => void;
  openPreferences: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

const copy = {
  zh: {
    title: "Cookie 政策",
    intro: "我们使用必要的本地存储来记住您的隐私选择。如果您允许可选外部媒体，高德地图可能使用 Cookie 或类似技术，并接收 IP 地址等技术信息。我们不使用广告或分析 Cookie。",
    policyLead: "请阅读我们的",
    policy: "Cookie 政策",
    reject: "仅使用必要 Cookie",
    manage: "Cookie 设置",
    accept: "允许全部 Cookie",
    preferencesTitle: "Cookie 设置",
    necessaryTitle: "必要项",
    necessaryDescription: "用于记住您的隐私选择并保障网站正常运行。",
    alwaysOn: "始终启用",
    externalTitle: "外部媒体",
    externalDescription: "允许加载高德地图。高德可能接收技术信息，并使用 Cookie 或类似技术。",
    on: "开启",
    off: "关闭",
    back: "返回",
    save: "保存选择",
  },
  en: {
    title: "Cookie Policy",
    intro:
      "We use necessary local storage to remember your privacy choices. If you allow optional external media, Google Maps may use cookies or similar technologies and receive technical information such as your IP address. We do not use advertising or analytics cookies.",
    policyLead: "Read our",
    policy: "Cookie Policy",
    reject: "Use necessary cookies only",
    manage: "Cookie settings",
    accept: "Allow all cookies",
    preferencesTitle: "Cookie preferences",
    necessaryTitle: "Necessary",
    necessaryDescription: "Required to remember your privacy choice and operate the website.",
    alwaysOn: "Always on",
    externalTitle: "External media",
    externalDescription:
      "Allows embedded Google Maps. Google may receive technical data and use cookies or similar technologies.",
    on: "On",
    off: "Off",
    back: "Back",
    save: "Save choices",
  },
  ja: {
    title: "Cookie ポリシー",
    intro:
      "本サイトでは、プライバシー設定を保存するために必要なローカルストレージを使用します。外部メディアを許可すると、Google Maps が Cookie 等を使用し、IP アドレスなどの技術情報を受信する場合があります。広告・アクセス解析 Cookie は使用していません。",
    policyLead: "詳しくは",
    policy: "Cookie ポリシー",
    reject: "必要な Cookie のみ使用",
    manage: "Cookie 設定",
    accept: "すべての Cookie を許可",
    preferencesTitle: "Cookie 設定",
    necessaryTitle: "必要な機能",
    necessaryDescription: "プライバシー設定の保存とウェブサイトの運営に必要です。",
    alwaysOn: "常に有効",
    externalTitle: "外部メディア",
    externalDescription:
      "Google Maps の埋め込みを許可します。Google が技術情報を受信し、Cookie 等を使用する場合があります。",
    on: "有効",
    off: "無効",
    back: "戻る",
    save: "選択を保存",
  },
} satisfies Record<Locale, Record<string, string>>;

function isStoredPreferences(value: unknown): value is ConsentPreferences {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<ConsentPreferences>;
  const expiresAt = typeof candidate.expiresAt === "string" ? Date.parse(candidate.expiresAt) : Number.NaN;
  return (
    candidate.version === CONSENT_VERSION &&
    typeof candidate.externalMedia === "boolean" &&
    typeof candidate.updatedAt === "string" &&
    Number.isFinite(expiresAt) &&
    expiresAt > Date.now()
  );
}

export function ConsentProvider({
  children,
  defaultLocale,
}: {
  children: ReactNode;
  defaultLocale: Locale;
}) {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDivElement>(null);
  const locale: Locale = pathname === "/zh" || pathname.startsWith("/zh/") ? "zh" : pathname === "/ja" || pathname.startsWith("/ja/")
    ? "ja"
    : pathname === "/en" || pathname.startsWith("/en/")
      ? "en"
      : defaultLocale;
  const [ready, setReady] = useState(false);
  const [hasDecision, setHasDecision] = useState(false);
  const [externalMedia, setExternalMedia] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [draftExternalMedia, setDraftExternalMedia] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
      if (raw) {
        const stored: unknown = JSON.parse(raw);
        if (isStoredPreferences(stored)) {
          setExternalMedia(stored.externalMedia);
          setDraftExternalMedia(stored.externalMedia);
          setHasDecision(true);
        } else {
          window.localStorage.removeItem(CONSENT_STORAGE_KEY);
        }
      }
    } catch {
      // A blocked storage API should not prevent visitors from using the site.
    } finally {
      setReady(true);
    }
  }, []);

  const persist = useCallback((nextExternalMedia: boolean) => {
    const preferences: ConsentPreferences = {
      version: CONSENT_VERSION,
      externalMedia: nextExternalMedia,
      updatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + CONSENT_DURATION_MS).toISOString(),
    };

    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // Keep the choice for this page view when storage is unavailable.
    }

    setExternalMedia(nextExternalMedia);
    setDraftExternalMedia(nextExternalMedia);
    setHasDecision(true);
    setPreferencesOpen(false);
  }, []);

  const openPreferences = useCallback(() => {
    setDraftExternalMedia(externalMedia);
    setPreferencesOpen(true);
  }, [externalMedia]);

  const contextValue = useMemo<ConsentContextValue>(
    () => ({
      externalMediaAllowed: ready && externalMedia,
      locale,
      grantExternalMedia: () => persist(true),
      openPreferences,
    }),
    [externalMedia, locale, openPreferences, persist, ready],
  );

  const labels = copy[locale];
  const visible = ready && (!hasDecision || preferencesOpen);

  useEffect(() => {
    if (!visible) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [preferencesOpen, visible]);

  function closeSettings() {
    setDraftExternalMedia(externalMedia);
    setPreferencesOpen(false);
  }

  function handleDialogKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && preferencesOpen) {
      event.preventDefault();
      closeSettings();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable?.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <ConsentContext.Provider value={contextValue}>
      {children}
      {visible ? (
        <section
          aria-describedby={preferencesOpen ? undefined : "consent-description"}
          aria-labelledby="consent-title"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto overscroll-contain bg-charcoal/[0.58] p-4 md:p-8"
          role="dialog"
        >
          <div
            className="w-full max-w-[64rem] bg-paper px-6 py-7 text-charcoal shadow-material outline-none sm:px-8 sm:py-8 lg:px-10 lg:py-9"
            onKeyDown={handleDialogKeyDown}
            ref={dialogRef}
            tabIndex={-1}
          >
            {preferencesOpen ? (
              <div>
                <div className="flex items-start justify-between gap-6">
                  <h2
                    className="font-sans text-[clamp(1.5rem,2.2vw,2.15rem)] font-medium uppercase leading-tight tracking-[0.015em]"
                    id="consent-title"
                  >
                    {labels.preferencesTitle}
                  </h2>
                  <Link
                    className="shrink-0 text-xs uppercase tracking-[0.08em] underline decoration-charcoal/30 underline-offset-4 transition-colors hover:text-gold"
                    href={localizedPath(locale, "/cookie-policy")}
                  >
                    {labels.policy}
                  </Link>
                </div>

                <div className="mt-8 divide-y divide-charcoal/15 border-y border-charcoal/15">
                  <div className="grid gap-3 py-6 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-10">
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-[0.1em]">{labels.necessaryTitle}</h3>
                      <p className="mt-2 max-w-[64ch] text-sm leading-7 text-muted">
                        {labels.necessaryDescription}
                      </p>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
                      {labels.alwaysOn}
                    </span>
                  </div>

                  <div className="grid gap-4 py-6 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-10">
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-[0.1em]">{labels.externalTitle}</h3>
                      <p className="mt-2 max-w-[64ch] text-sm leading-7 text-muted">
                        {labels.externalDescription}
                      </p>
                    </div>
                    <button
                      aria-checked={draftExternalMedia}
                      aria-label={labels.externalTitle}
                      className="inline-flex min-h-11 min-w-[9.5rem] items-center justify-between gap-4 justify-self-start overflow-visible border border-charcoal/25 px-3 text-xs font-semibold uppercase tracking-[0.1em] transition-colors hover:border-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:justify-self-end"
                      onClick={() => setDraftExternalMedia((current) => !current)}
                      role="switch"
                      type="button"
                    >
                      <span
                        aria-hidden="true"
                        className={`relative h-5 w-9 rounded-full transition-colors ${draftExternalMedia ? "bg-charcoal" : "bg-charcoal/20"}`}
                      >
                        <span
                          className={`absolute top-0.5 h-4 w-4 rounded-full bg-paper transition-transform duration-300 ease-expo ${draftExternalMedia ? "translate-x-[1.125rem]" : "translate-x-0.5"}`}
                        />
                      </span>
                      <span className="min-w-[2.5rem] text-center">
                        {draftExternalMedia ? labels.on : labels.off}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    className="min-h-12 border border-charcoal/25 px-6 text-xs font-semibold uppercase tracking-[0.1em] transition-colors hover:border-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                    onClick={closeSettings}
                    type="button"
                  >
                    {labels.back}
                  </button>
                  <button
                    className="min-h-12 bg-charcoal px-6 text-xs font-semibold uppercase tracking-[0.1em] text-paper transition-colors hover:bg-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                    onClick={() => persist(draftExternalMedia)}
                    type="button"
                  >
                    {labels.save}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex md:min-h-[20rem] flex-col">
                <h2
                  className="max-w-[30ch] font-sans text-[clamp(1.35rem,1.8vw,1.8rem)] font-medium uppercase leading-tight tracking-[0.015em]"
                  id="consent-title"
                >
                  {labels.title}
                </h2>
                <p
                  className="mt-5 max-w-[78ch] text-[0.95rem] leading-7 text-charcoal/78 sm:text-base sm:leading-8"
                  id="consent-description"
                >
                  {labels.intro}{" "}
                  {labels.policyLead}{" "}
                  <Link
                    className="underline decoration-charcoal/35 underline-offset-4 transition-colors hover:text-gold"
                    href={localizedPath(locale, "/cookie-policy")}
                  >
                    {labels.policy}
                  </Link>
                  {locale === "zh" ? "。" : locale === "en" ? "." : "をご覧ください。"}
                </p>

                <div className="mt-9 flex flex-col gap-7 md:mt-auto md:flex-row md:items-end md:justify-between md:gap-10">
                  <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
                    <button
                      className="w-fit text-left text-xs font-semibold uppercase tracking-[0.08em] underline decoration-charcoal/45 underline-offset-4 transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                      onClick={openPreferences}
                      type="button"
                    >
                      {labels.manage}
                    </button>
                    <button
                      className="w-fit text-left text-xs font-semibold uppercase tracking-[0.08em] underline decoration-charcoal/45 underline-offset-4 transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                      onClick={() => persist(false)}
                      type="button"
                    >
                      {labels.reject}
                    </button>
                  </div>
                  <button
                    className="min-h-14 w-full bg-charcoal px-7 text-xs font-semibold uppercase tracking-[0.1em] text-paper transition-colors hover:bg-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:w-auto sm:min-w-[16rem]"
                    onClick={() => persist(true)}
                    type="button"
                  >
                    {labels.accept}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      ) : null}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used within ConsentProvider");
  }
  return context;
}
