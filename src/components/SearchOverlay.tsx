"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/locales";

type SearchResult = {
  label: string;
  sub: string;
  localeHrefs: Record<string, string>;
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
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`,
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
  }, [query]);

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
    >
      {/* Top 60% — white */}
      <div className="flex h-[60vh] flex-col bg-white">
        <div className="flex justify-end px-margin-mobile pt-6 md:pt-8">
          <button
            aria-label="Close search"
            className="flex h-10 w-10 items-center justify-center text-charcoal/30 transition-colors hover:text-charcoal"
            onClick={onClose}
            type="button"
          >
            <X size={22} strokeWidth={1.2} />
          </button>
        </div>

        <div className="flex flex-1 items-start justify-center px-margin-mobile pt-[10vh]">
          <div className="w-full max-w-2xl">
            <div className="flex items-center gap-4 border-b border-charcoal/30 pb-4">
              <Search size={18} strokeWidth={1.2} className="shrink-0 text-charcoal/30" />
              <input
                ref={inputRef}
                className="w-full bg-transparent font-sans text-xl font-light text-charcoal outline-none placeholder:text-charcoal/20"
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                type="text"
                value={query}
              />
            </div>

            {results.length > 0 ? (
              <ul className="mt-8 space-y-1">
                {results.map((result) => (
                  <li key={result.localeHrefs[locale] ?? result.localeHrefs.en}>
                    <Link
                      className="flex items-baseline gap-4 rounded-md px-4 py-3 transition-colors hover:bg-stone"
                      href={result.localeHrefs[locale] ?? result.localeHrefs.en}
                      onClick={onClose}
                    >
                      <span className="font-serif text-lg text-charcoal">
                        {result.label}
                      </span>
                      <span className="label-caps text-charcoal/30">{result.sub}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : query.length >= 2 ? (
              <p className="mt-8 text-center font-sans text-base tracking-wide text-charcoal/35">
                Nothing found for &ldquo;{query}&rdquo;
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Bottom 40% — dark glass */}
      <div className="h-[40vh] bg-charcoal/92 backdrop-blur-md" />
    </div>
  );
}
