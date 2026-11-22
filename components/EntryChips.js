"use client";

import translations from "../data/translations.js";
import { useLanguage } from "../context/LanguageContext.js";

// The category, festival day and tags of an entry, as small read-only labels.
export default function EntryChips({ category, festivalDay, tags }) {
  const { lang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;
  const list = tags ?? [];

  if (!category && !festivalDay && list.length === 0) return null;

  return (
    <div className="chip-row" style={{ margin: "0 0 24px" }}>
      {category && (
        <span className="chip is-static is-category">{t[`category_${category}`] ?? category}</span>
      )}
      {festivalDay && (
        <span className="chip is-static">{t[`day_${festivalDay}`] ?? festivalDay}</span>
      )}
      {list.map((tag) => (
        <span key={tag} className="chip is-static">
          #{t[`tag_${tag}`] ?? tag}
        </span>
      ))}
    </div>
  );
}