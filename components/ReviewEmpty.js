"use client";

import Link from "next/link";
import translations from "../data/translations.js";
import { useLanguage } from "../context/LanguageContext.js";

const styles = {
  box: {
    padding: "48px 24px",
    textAlign: "center",
    backgroundColor: "#FCFAF5",
    border: "1px solid #D8DED5",
    borderRadius: 12,
  },
  icon: {
    width: 64,
    height: 64,
    margin: "0 auto 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#2D5F4C",
    backgroundColor: "#E6EFE9",
    borderRadius: "50%",
  },
  title: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 24,
    fontWeight: 700,
    color: "#2D5F4C",
    margin: "0 0 8px",
  },
  text: { fontSize: 16, margin: "0 0 4px" },
  hint: { fontSize: 14, color: "#6B6B63", margin: "0 0 24px" },
  link: {
    display: "inline-block",
    padding: "10px 22px",
    fontSize: 15,
    fontWeight: 600,
    color: "#FCFAF5",
    backgroundColor: "#2D5F4C",
    borderRadius: 8,
    textDecoration: "none",
  },
};

export default function ReviewEmpty() {
  const { lang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;

  return (
    <div style={styles.box}>
      <div style={styles.icon} aria-hidden="true">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </div>
      <h2 style={styles.title}>{t.review_empty_title}</h2>
      <p style={styles.text}>{t.review_empty}</p>
      <p style={styles.hint}>{t.review_empty_hint}</p>
      <Link href="/entries" style={styles.link}>
        {t.review_view_archive}
      </Link>
    </div>
  );
}