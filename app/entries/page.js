"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import translations from "../../data/translations.js";
import EntryCard from "../../components/EntryCard.js";
import { createClient } from "../../utils/supabase/client.js";
import { useLanguage } from "../../context/LanguageContext.js";
import { useScrollReveal } from "../../hooks/useScrollReveal.js";

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

// A gray placeholder shaped like a card, shown while entries load.
function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-media" />
      <div className="skeleton skeleton-line title" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line short" />
    </div>
  );
}

const styles = {
  headerRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "24px 32px",
  },
  accent: {
    width: 48,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#C97B5B",
    marginBottom: 16,
  },
  title: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "clamp(34px, 5vw, 46px)",
    fontWeight: 700,
    color: "#2D5F4C",
    margin: 0,
    lineHeight: 1.15,
  },
  countRow: { minHeight: 34, marginTop: 14 },
  count: {
    display: "inline-block",
    margin: 0,
    padding: "6px 14px",
    fontSize: 14,
    color: "#2D5F4C",
    backgroundColor: "#E6EFE9",
    borderRadius: 999,
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
    display: "block",
    height: "100%",
    textDecoration: "none",
    color: "inherit",
    cursor: "pointer",
  },
  gridWrap: { marginTop: 40 },
};

export default function EntriesPage() {
  const [query, setQuery] = useState("");
  const { lang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;
  const [gridRef, gridVisible] = useScrollReveal();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadEntries() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("entries")
        .select("id, slug, title, description, contributor, place, image:photo_url")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (!active) return;
      if (error) {
        console.error("Failed to load entries:", error);
      }
      setEntries(data ?? []);
      setLoading(false);
    }
    loadEntries();
    return () => {
      active = false;
    };
  }, []);

  const filteredEntries = entries.filter((entry) => {
    const q = query.trim().toLowerCase();
    const km = translations.km[entry.slug];
    return (
      entry.title.toLowerCase().includes(q) ||
      entry.description.toLowerCase().includes(q) ||
      km?.title.toLowerCase().includes(q) ||
      km?.description.toLowerCase().includes(q)
    );
  });

  let entriesContent;
  if (loading) {
    entriesContent = (
      <div className="entries-grid" style={styles.gridWrap} aria-busy="true">
        {Array.from({ length: 6 }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  } else if (filteredEntries.length === 0) {
    entriesContent = (
      <div style={styles.emptyState}>
        <p>{t.no_results}</p>
      </div>
    );
  } else {
    entriesContent = (
      <div
        ref={gridRef}
        className={`entries-grid fade-in-on-scroll ${
          gridVisible ? "is-visible" : ""
        }`}
        style={styles.gridWrap}
      >
        {filteredEntries.map((entry) => {
          const km = translations.km[entry.slug];
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
    );
  }

  return (
    <main className="page-container wide">
      <div style={styles.headerRow}>
        <div>
          <div style={styles.accent} aria-hidden="true" />
          <h1 className="fade-in-up" style={styles.title}>
            {t.nav_entries}
          </h1>
          <div style={styles.countRow}>
            {!loading && (
              <p style={styles.count}>
                {t.entries_count_prefix} <strong>{entries.length}</strong>{" "}
                {t.entries_count_suffix}
              </p>
            )}
          </div>
        </div>

        <div className="search-field">
          <span className="search-icon">
            <SearchIcon />
          </span>
          <input
            type="text"
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search_placeholder}
            aria-label={t.search_placeholder}
          />
          {query && (
            <button
              type="button"
              className="search-clear"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <ClearIcon />
            </button>
          )}
        </div>
      </div>

      {entriesContent}
    </main>
  );
}