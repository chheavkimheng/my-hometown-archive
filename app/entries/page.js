"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import translations from "../../data/translations.js";
import EntryCard from "../../components/EntryCard.js";
import { createClient } from "../../utils/supabase/client.js";
import { useLanguage } from "../../context/LanguageContext.js";
import { useScrollReveal } from "../../hooks/useScrollReveal.js";

function ClearIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

const styles = {
  searchWrap: {
    position: "relative",
  },
  searchInput: {
    width: "100%",
    padding: "14px 44px 14px 18px",
    fontSize: 16,
    color: "#2B2B2B",
    backgroundColor: "#FCFAF5",
    border: "1px solid #D8DED5",
    borderRadius: 10,
    boxSizing: "border-box",
  },
  clearButton: {
    position: "absolute",
    right: 14,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "#6B6B63",
    cursor: "pointer",
    padding: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadEntries() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("entries")
        .select("id, slug, title, description, contributor, place, image:photo_url")
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
      <div style={styles.emptyState}>
        <p>Loading entries…</p>
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
      <div style={styles.searchWrap}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.search_placeholder}
          aria-label={t.search_placeholder}
          style={styles.searchInput}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            style={styles.clearButton}
          >
            <ClearIcon />
          </button>
        )}
      </div>

      {entriesContent}

      <p style={styles.count}>
        {t.entries_count_prefix} {entries.length} {t.entries_count_suffix}
      </p>
    </main>
  );
}