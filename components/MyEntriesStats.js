"use client";

import translations from "../data/translations.js";
import { useLanguage } from "../context/LanguageContext.js";

const CARDS = [
  { key: "all", label: "my_filter_all", accent: "#2D5F4C" },
  { key: "pending", label: "my_stat_pending", accent: "#C97B5B" },
  { key: "published", label: "my_stat_published", accent: "#2D5F4C" },
  { key: "returned", label: "my_stat_returned", accent: "#B3261E" },
];

export default function MyEntriesStats({ counts, filter, onChange }) {
  const { lang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;

  return (
    <div className="stat-grid" role="group">
      {CARDS.map((card) => (
        <button
          key={card.key}
          type="button"
          className={`stat-card ${filter === card.key ? "is-active" : ""}`}
          aria-pressed={filter === card.key}
          style={{ "--accent": card.accent }}
          onClick={() => onChange(card.key)}
        >
          <span className="stat-number">{counts[card.key]}</span>
          <span className="stat-label">{t[card.label]}</span>
        </button>
      ))}
    </div>
  );
}