"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { localizedPath, type Locale } from "@/lib/locales";

type SearchResult = {
  label: string;
  sub: string;
  href: string;
};

type SearchOverlayProps = {
  locale: Locale;
  open: boolean;
  onClose: () => void;
};

export function SearchOverlay({ locale, open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [visible, setVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      requestAnimationFrame(() => {
        setVisible(true);
        requestAnimationFrame(() => inputRef.current?.focus());
      });
    } else {
      setVisible(false);
    }
  }, [open]);

  useEffect(() => {
    if (query.length < (locale === "zh" ? 1 : 2)) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&locale=${locale}`,
          { signal: controller.signal }
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data.results);
        }
      } catch {
        // aborted or network error
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, locale]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
      };
    }
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[60] flex flex-col transition-transform duration-500 ease-in-out ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
      data-lenis-prevent
    >
      {/* Give touch layouts a scrollable result panel above the on-screen keyboard. */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white md:h-[60vh] md:flex-none">
        <div className="flex shrink-0 justify-end px-margin-mobile pt-4 md:pt-8">
          <button
            aria-label={locale === "zh" ? "关闭搜索" : "Close search"}
            className="flex h-11 w-11 items-center justify-center text-muted transition-colors hover:text-charcoal"
            onClick={onClose}
            type="button"
          >
            <X size={22} strokeWidth={1.2} />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 items-start justify-center overflow-y-auto overscroll-contain px-margin-mobile pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 md:pt-[6vh]">
          <div className="w-full min-w-0 max-w-2xl">
            <div className="flex items-center gap-4 border-b border-charcoal/30 pb-4">
              <Search size={18} strokeWidth={1.2} className="shrink-0 text-charcoal/30" />
              <input
                ref={inputRef}
                className="min-w-0 flex-1 bg-transparent font-sans text-base font-light text-charcoal outline-none placeholder:text-muted md:text-xl"
                onChange={(e) => setQuery(e.target.value)}
                placeholder={locale === "zh" ? "搜索材料、型号和案例" : "Search"}
                type="text"
                value={query}
              />
            </div>

            {results.length > 0 ? (
              <ul className="mt-8 space-y-1">
                {results.map((result) => (
                  <li key={result.href}>
                    <Link
                      className="flex min-h-11 flex-col gap-1 rounded-md px-4 py-3 transition-colors hover:bg-stone md:flex-row md:items-baseline md:gap-4"
                      href={localizedPath(locale,result.href)}
                      onClick={onClose}
                    >
                      <span className="min-w-0 break-words font-serif text-lg text-charcoal">
                        {result.label}
                      </span>
                      <span className="label-caps text-muted">{result.sub}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : query.length >= (locale === "zh" ? 1 : 2) ? (
              <p className="mt-8 break-words text-center font-sans text-base tracking-wide text-muted">
                Nothing found for &ldquo;{query}&rdquo;
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Bottom 40% — dark glass */}
      <div className="hidden h-[40vh] shrink-0 bg-charcoal/92 backdrop-blur-md md:block" />
    </div>
  );
}
