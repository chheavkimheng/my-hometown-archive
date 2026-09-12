"use client";

import { useRouter } from "next/navigation";
import translations from "../data/translations.js";
import { useLanguage } from "../context/LanguageContext.js";

const styles = {
  backButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 32,
    padding: "10px 18px",
    border: "1px solid #D8DED5",
    borderRadius: 999,
    color: "#2D5F4C",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "inherit",
    cursor: "pointer",
  },
  image: {
    width: "100%",
    height: "auto",
    borderRadius: 12,
    marginBottom: 24,
    display: "block",
  },
  title: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 36,
    fontWeight: 700,
    color: "#2D5F4C",
    margin: "0 0 16px",
    lineHeight: 1.2,
  },
  description: {
    fontSize: 17,
    lineHeight: 1.7,
    margin: "0 0 32px",
    maxWidth: 680,
  },
  metaRow: {
    display: "flex",
    gap: 32,
    flexWrap: "wrap",
    paddingTop: 24,
    borderTop: "1px solid #D8DED5",
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "#C97B5B",
    margin: 0,
  },
  metaValue: {
    fontSize: 15,
    margin: "4px 0 0",
  },
};

function BackArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5M5 12l6-6M5 12l6 6" />
    </svg>
  );
}

export default function EntryDetail({ entry, translation }) {
  const { lang } = useLanguage();
  const router = useRouter();
  const t = translations[lang]?.ui ?? translations.en.ui;

  const displayTitle =
    lang === "km" && translation?.title ? translation.title : entry.title;
  const displayDescription =
    lang === "km" && translation?.description
      ? translation.description
      : entry.description;
  const displayContributor =
    lang === "km" && translation?.contributor
      ? translation.contributor
      : entry.contributor;
  const displayPlace =
    lang === "km" && translation?.place ? translation.place : entry.place;

  return (
    <main className="page-container">
      <button
        type="button"
        onClick={() => router.back()}
        className="back-button"
        style={styles.backButton}
      >
        <BackArrowIcon />
        {t.back_to_entries}
      </button>

      {entry.image && (
        <img src={entry.image} alt={displayTitle} style={styles.image} />
      )}

      <h1 style={styles.title}>{displayTitle}</h1>
      <p style={styles.description}>{displayDescription}</p>

      <div style={styles.metaRow}>
        <div>
          <p style={styles.metaLabel}>{t.contributor_label}</p>
          <p style={styles.metaValue}>{displayContributor}</p>
        </div>
        <div>
          <p style={styles.metaLabel}>{t.place_label}</p>
          <p style={styles.metaValue}>{displayPlace}</p>
        </div>
      </div>
    </main>
  );
}