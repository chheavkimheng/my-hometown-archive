"use client";

import translations from "../data/translations.js";
import { useLanguage } from "../context/LanguageContext.js";

const styles = {
  row: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 16,
    marginBottom: 32,
  },
  card: {
    padding: "16px 20px",
    backgroundColor: "#FCFAF5",
    border: "1px solid #D8DED5",
    borderRadius: 10,
  },
  number: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 32,
    fontWeight: 700,
    color: "#2D5F4C",
    margin: 0,
  },
  label: { fontSize: 13, color: "#6B6B63", margin: "4px 0 0" },
};

export default function ReviewStats({ pending, published, returned }) {
  const { lang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;

  const stats = [
    { label: t.review_stat_pending, value: pending },
    { label: t.review_stat_published, value: published },
    { label: t.review_stat_returned, value: returned },
  ];

  return (
    <div style={styles.row}>
      {stats.map((stat) => (
        <div key={stat.label} style={styles.card}>
          <p style={styles.number}>{stat.value}</p>
          <p style={styles.label}>{stat.label}</p>
        </div>
      ))}
    </div>
  );
}