"use client";

import { useState } from "react";
import collection from "../collection.config.js";
import entries from "../data/entries.js";
import translations from "../data/translations.js";
import EntryCard from "../components/EntryCard.js";

const styles = {
  wrap: {
    maxWidth: 720,
    margin: "40px auto",
    padding: "64px 40px",
    backgroundColor: "#FDF6E3",
    color: "#3D2817",
    borderRadius: 20,
    border: "1px solid #D4AF37",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
  },
  kicker: {
    fontFamily: "'Courier New', monospace",
    color: "#E8871E",
    fontSize: 14,
    letterSpacing: 1,
  },
  title: {
    fontSize: 48,
    fontWeight: 700,
    margin: "16px 0 12px",
    lineHeight: 1.1,
    color: "#A6192E",
  },
  description: {
    fontSize: 18,
    color: "#7A5C3E",
    lineHeight: 1.6,
    margin: 0,
  },
  card: {
    marginTop: 48,
    padding: 24,
    backgroundColor: "#FFFBF0",
    border: "1px solid #D4AF37",
    borderRadius: 10,
  },
  cardLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#A6192E",
    margin: 0,
  },
  cardValue: {
    fontSize: 16,
    margin: "6px 0 0",
  },
  langToggle: {
    display: "flex",
    gap: 8,
    marginTop: 48,
  },
  langButton: {
    padding: "6px 16px",
    fontFamily: "'Courier New', monospace",
    fontSize: 13,
    fontWeight: 600,
    border: "1px solid #D4AF37",
    borderRadius: 20,
    backgroundColor: "transparent",
    color: "#7A5C3E",
    cursor: "pointer",
  },
  langButtonActive: {
    backgroundColor: "#A6192E",
    color: "#FDF6E3",
    borderColor: "#A6192E",
  },
  count: {
    fontFamily: "'Courier New', monospace",
    fontSize: 14,
    color: "#E8871E",
    marginTop: 48,
  },
  footer: {
    marginTop: 64,
    paddingTop: 24,
    borderTop: "1px solid #D4AF37",
    fontSize: 13,
    color: "#8B6F47",
  },
  searchInput: {
    width: "100%",
    marginTop: 16,
    padding: "12px 16px",
    fontSize: 16,
    color: "#3D2817",
    backgroundColor: "#FFFBF0",
    border: "1px solid #D4AF37",
    borderRadius: 8,
    boxSizing: "border-box",
  },
  emptyState: {
    marginTop: 24,
    padding: 24,
    border: "1px solid #D4AF37",
    borderRadius: 10,
    color: "#7A5C3E",
  },
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("en");

  const filteredEntries = entries.filter((entry) => {
    const q = query.toLowerCase();
    return (
      entry.title.toLowerCase().includes(q) ||
      entry.description.toLowerCase().includes(q)
    );
  });

  return (
    <main style={styles.wrap}>
      <p style={styles.kicker}>KHMER LIVING ARCHIVE</p>
      <h1 style={styles.title}>{collection.name}</h1>
      <p style={styles.description}>{collection.description}</p>

      <div style={styles.card}>
        <p style={styles.cardLabel}>CURATED BY</p>
        <p style={styles.cardValue}>{collection.curator}</p>
      </div>
      <div style={styles.card}>
        <p style={styles.cardLabel}>SOURCE</p>
        <p style={styles.cardValue}>{collection.source}</p>
      </div>

      <div style={styles.langToggle}>
        <button
          type="button"
          onClick={() => setLang("en")}
          style={{
            ...styles.langButton,
            ...(lang === "en" ? styles.langButtonActive : {}),
          }}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => setLang("km")}
          style={{
            ...styles.langButton,
            ...(lang === "km" ? styles.langButtonActive : {}),
          }}
        >
          KM
        </button>
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search entries..."
        aria-label="Search entries"
        style={styles.searchInput}
      />

      {filteredEntries.length === 0 ? (
        <div style={styles.emptyState}>
          <p>
            {lang === "km"
              ? "រកមិនឃើញធាតុណាដែលត្រូវនឹងការស្វែងរករបស់អ្នកទេ។"
              : "No entries match your search."}
          </p>
        </div>
      ) : (
        filteredEntries.map((entry) => {
          const t = translations.km[entry.id];
          const displayTitle =
            lang === "km" && t?.title ? t.title : entry.title;
          const displayDescription =
            lang === "km" && t?.description ? t.description : entry.description;
          return (
            <EntryCard
              key={entry.id}
              {...entry}
              title={displayTitle}
              description={displayDescription}
            />
          );
        })
      )}

      <p style={styles.count}>
        entries in the archive: {entries.length} (for now)
      </p>

      <footer style={styles.footer}>
        Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall
        2026. This archive is under construction all semester. Come back in
        December.
      </footer>
    </main>
  );
}