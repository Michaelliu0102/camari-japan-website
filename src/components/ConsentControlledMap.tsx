"use client";

import { useConsent } from "@/components/ConsentManager";

const copy = {
  en: {
    eyebrow: "Google Maps",
    message: "This map is provided by Google and remains blocked until you allow external media.",
    enable: "Allow and show map",
    open: "Open in Google Maps",
  },
  ja: {
    eyebrow: "Google Maps",
    message: "この地図は Google により提供されます。外部メディアを許可するまで読み込まれません。",
    enable: "許可して地図を表示",
    open: "Google Maps で開く",
  },
} as const;

type ConsentControlledMapProps = {
  className?: string;
  directUrl: string;
  src: string;
  title: string;
};

export function ConsentControlledMap({ className = "", directUrl, src, title }: ConsentControlledMapProps) {
  const { externalMediaAllowed, grantExternalMedia, locale } = useConsent();
  const labels = copy[locale];

  if (externalMediaAllowed) {
    return (
      <iframe
        allowFullScreen
        className={className}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={src}
        style={{ border: 0 }}
        title={title}
      />
    );
  }

  return (
    <div
      aria-label={title}
      className={`flex items-center justify-center bg-stone px-6 py-10 text-center ${className}`}
      role="region"
    >
      <div className="max-w-md">
        <p className="label-caps text-gold">{labels.eyebrow}</p>
        <p className="mt-4 text-sm leading-7 text-charcoal/70">{labels.message}</p>
        <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
          <button
            className="min-h-11 bg-charcoal px-5 text-xs font-semibold uppercase tracking-[0.12em] text-paper transition-colors hover:bg-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            onClick={grantExternalMedia}
            type="button"
          >
            {labels.enable}
          </button>
          <a
            className="flex min-h-11 items-center justify-center border border-charcoal/20 px-5 text-xs font-semibold uppercase tracking-[0.12em] text-charcoal transition-colors hover:border-gold hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            href={directUrl}
            rel="noreferrer"
            target="_blank"
          >
            {labels.open}
          </a>
        </div>
      </div>
    </div>
  );
}
