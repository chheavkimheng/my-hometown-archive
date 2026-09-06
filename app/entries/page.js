"use client";

import { useState } from "react";
import Link from "next/link";
import entries from "../../data/entries.js";
import translations from "../../data/translations.js";
import EntryCard from "../../components/EntryCard.js";
import { useLanguage } from "../../context/LanguageContext.js";
import { useScrollReveal } from "../../hooks/useScrollReveal.js";

const styles = {
  searchInput: {
    width: "100%",
    padding: "14px 18px",
    fontSize: 16,
    color: "#2B2B2B",
    backgroundColor: "#FCFAF5",
    border: "1px solid #D8DED5",
    borderRadius: 10,
    boxSizing: "border-box",
  },
  emptyState: {
    marginTop: 32,
    padding: 24,
    border: "1px solid #D8DED5",
    borderRadius: 10,
    color: "#6B6B63",
    backgroundColor: "#FCFAF5",
  },
  cardLink: {
    textDecoration: "none",
    color: "inherit",
    cursor: "pointer",
  },
  count: {
    marginTop: 32,
    fontSize: 14,
    color: "#C97B5B",
  },
  gridWrap: {
    marginTop: 40,
  },
};

export default function EntriesPage() {
  const [query, setQuery] = useState("");
  const { lang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;
  const [gridRef, gridVisible] = useScrollReveal();

  // Matches either language, regardless of which one is displayed.
  const filteredEntries = entries.filter((entry) => {
    const q = query.toLowerCase();
    const km = translations.km[entry.id];
    return (
      entry.title.toLowerCase().includes(q) ||
      entry.description.toLowerCase().includes(q) ||
      (km?.title && km.title.toLowerCase().includes(q)) ||
      (km?.description && km.description.toLowerCase().includes(q))
    );
  });

  return (
    <main className="page-container wide">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.search_placeholder}
        aria-label={t.search_placeholder}
        style={styles.searchInput}
      />

      {filteredEntries.length === 0 ? (
        <div style={styles.emptyState}>
          <p>{t.no_results}</p>
        </div>
      ) : (
        <div
          ref={gridRef}
          className={`entries-grid fade-in-on-scroll ${
            gridVisible ? "is-visible" : ""
          }`}
          style={styles.gridWrap}
        >
          {filteredEntries.map((entry) => {
            const km = translations.km[entry.id];
            const displayTitle =
              lang === "km" && km?.title ? km.title : entry.title;
            const displayDescription =
              lang === "km" && km?.description
                ? km.description
                : entry.description;
            const displayPlace =
              lang === "km" && km?.place ? km.place : entry.place;
            return (
              <Link
                key={entry.id}
                href={`/entries/${entry.id}`}
                style={styles.cardLink}
              >
                <EntryCard
                  {...entry}
                  title={displayTitle}
                  description={displayDescription}
                  place={displayPlace}
                />
              </Link>
            );
          })}
        </div>
      )}

      <p style={styles.count}>
        {t.entries_count_prefix} {entries.length} {t.entries_count_suffix}
      </p>
    </main>
  );
}