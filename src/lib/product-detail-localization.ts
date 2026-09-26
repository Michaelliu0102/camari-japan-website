type Detail = { en: string; ja: string; zh?: string };
type Translation = { source: string; text: string };

export function alignJapaneseDetails<T extends Detail>(details: T[], translations: Translation[], label: string): T[] {
  if (details.length !== translations.length) throw new Error(`${label}: English/Japanese detail counts differ.`);
  const bySource = new Map<string, string>();
  for (const entry of translations) {
    if (!entry.source?.trim() || !entry.text?.trim() || bySource.has(entry.source)) {
      throw new Error(`${label}: missing or duplicate Japanese detail source/translation.`);
    }
    bySource.set(entry.source, entry.text);
  }
  const seen = new Set<string>();
  return details.map(detail => {
    if (!detail.en?.trim() || seen.has(detail.en) || !bySource.has(detail.en)) {
      throw new Error(`${label}: unmatched or duplicate English detail: ${detail.en}`);
    }
    seen.add(detail.en);
    return { ...detail, ja: bySource.get(detail.en)! };
  });
}

export function requireUniqueMatch<T>(items: T[], matches: (item: T) => boolean, label: string): T {
  const found = items.filter(matches);
  if (found.length !== 1) throw new Error(`${label}: expected one identity match, found ${found.length}.`);
  return found[0];
}
