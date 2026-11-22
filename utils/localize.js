import translations from "../data/translations.js";

// Returns the entry with the text to show for the chosen language.
// Khmer: the entry's own Khmer text first, then the translations file (the first eight
// entries), then English.
export function localizedEntry(entry, lang) {
  if (lang !== "km") return entry;
  const old = translations.km[entry.slug];
  const contributor = old?.contributor || entry.contributor;
  return {
    ...entry,
    title: entry.title_km || old?.title || entry.title,
    description: entry.description_km || old?.description || entry.description,
    contributor,
    place: old?.place || entry.place,
    // The first entries copy their source from the contributor, so they get the Khmer name too.
    source: entry.source && entry.source === entry.contributor ? contributor : entry.source,
  };
}