"use client";

import translations from "../data/translations.js";
import { useLanguage } from "../context/LanguageContext.js";

const button = {
  padding: "10px 20px",
  fontSize: 14,
  fontWeight: 600,
  borderRadius: 8,
  cursor: "pointer",
};

const styles = {
  card: {
    padding: 20,
    backgroundColor: "#FCFAF5",
    border: "1px solid #D8DED5",
    borderRadius: 10,
  },
  image: {
    width: "100%",
    maxHeight: 280,
    objectFit: "cover",
    borderRadius: 8,
    marginBottom: 16,
    display: "block",
  },
  title: { fontSize: 20, fontWeight: 700, color: "#2D5F4C", margin: "0 0 8px" },
  description: { fontSize: 15, lineHeight: 1.7, margin: "0 0 12px", whiteSpace: "pre-wrap" },
  meta: { fontSize: 13, color: "#6B6B63", margin: "0 0 16px" },
  row: { display: "flex", gap: 12 },
  publish: { ...button, color: "#FCFAF5", backgroundColor: "#2D5F4C", border: "none" },
  returnButton: { ...button, color: "#8A3B1E", backgroundColor: "#FFFFFF", border: "1px solid #8A3B1E" },
  busy: { opacity: 0.6, cursor: "not-allowed" },
  failed: { fontSize: 14, color: "#B3261E", margin: "12px 0 0" },
};

export default function ReviewItem({ entry, busy, failed, onReview }) {
  const { lang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;
  const dim = busy ? styles.busy : {};
  const place = entry.place ? ` · ${t.place_label}: ${entry.place}` : "";
  const submitted = ` · ${t.review_submitted}: ${entry.created_at.slice(0, 10)}`;

  return (
    <article style={styles.card}>
      {entry.image && <img src={entry.image} alt={entry.title} style={styles.image} />}
      <h2 style={styles.title}>{entry.title}</h2>
      <p style={styles.description}>{entry.description}</p>
      <p style={styles.meta}>
        {t.contributor_label}: {entry.contributor}
        {place}
        {submitted}
      </p>
      <div style={styles.row}>
        <button
          type="button"
          disabled={busy}
          onClick={() => onReview(entry.id, "published")}
          style={{ ...styles.publish, ...dim }}
        >
          {t.review_publish}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => onReview(entry.id, "returned")}
          style={{ ...styles.returnButton, ...dim }}
        >
          {t.review_return}
        </button>
      </div>
      {failed && <p role="alert" style={styles.failed}>{t.review_failed}</p>}
    </article>
  );
}