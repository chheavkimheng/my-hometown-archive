"use client";

import Link from "next/link";
import collection from "../../collection.config.js";
import translations from "../../data/translations.js";
import { useLanguage } from "../../context/LanguageContext.js";

const serif = "Georgia, 'Times New Roman', serif";

const styles = {
  kicker: {
    fontFamily: serif,
    fontStyle: "italic",
    color: "#C97B5B",
    fontSize: 16,
    margin: 0,
  },
  title: {
    fontFamily: serif,
    fontSize: 44,
    fontWeight: 700,
    margin: "16px 0 12px",
    lineHeight: 1.15,
    color: "#2D5F4C",
  },
  description: { fontSize: 18, color: "#6B6B63", lineHeight: 1.6, margin: 0 },
  heading: {
    fontFamily: serif,
    fontSize: 26,
    fontWeight: 700,
    color: "#2D5F4C",
    margin: "56px 0 16px",
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 1.8,
    color: "#2B2B2B",
    margin: "0 0 16px",
    maxWidth: 760,
  },
  itemGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 20,
    marginTop: 24,
  },
  item: {
    padding: 24,
    backgroundColor: "#FCFAF5",
    border: "1px solid #D8DED5",
    borderRadius: 10,
  },
  itemTitle: {
    fontFamily: serif,
    fontSize: 20,
    fontWeight: 700,
    color: "#2D5F4C",
    margin: "0 0 10px",
  },
  itemText: { fontSize: 15, lineHeight: 1.7, color: "#2B2B2B", margin: 0 },
  card: {
    marginTop: 24,
    padding: 24,
    backgroundColor: "#FCFAF5",
    border: "1px solid #D8DED5",
    borderRadius: 10,
  },
  cardLabel: { fontSize: 12, fontWeight: 700, color: "#2D5F4C", margin: 0 },
  cardValue: { fontSize: 16, margin: "6px 0 0" },
  ctaWrap: { marginTop: 56 },
  ctaButton: {
    display: "inline-block",
    padding: "14px 32px",
    color: "#FCFAF5",
    fontSize: 16,
    fontWeight: 600,
    textDecoration: "none",
    borderRadius: 8,
  },
};

export default function AboutPage() {
  const { lang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;
  const archiveDescription =
    lang === "km" ? t.archive_description : collection.description;
  const archiveSource = lang === "km" ? t.archive_source : collection.source;
  const curatorName = lang === "km" ? t.curator_name : collection.curator;

  return (
    <main className="page-container">
      <p className="fade-in-up" style={styles.kicker}>
        {t.hero_kicker}
      </p>
      <h1 className="fade-in-up" style={styles.title}>
        {t.about_title}
      </h1>
      <p className="fade-in-up" style={styles.description}>
        {archiveDescription}
      </p>

      <h2 style={styles.heading}>{t.about_purpose_heading}</h2>
      {t.about_purpose.map((paragraph) => (
        <p key={paragraph} style={styles.paragraph}>
          {paragraph}
        </p>
      ))}

      <h2 style={styles.heading}>{t.about_story_heading}</h2>
      {t.landing_intro.map((paragraph) => (
        <p key={paragraph} style={styles.paragraph}>
          {paragraph}
        </p>
      ))}

      {t.about_sections.map((section) => (
        <section key={section.heading}>
          <h2 style={styles.heading}>{section.heading}</h2>
          {section.intro && <p style={styles.paragraph}>{section.intro}</p>}
          {section.items && (
            <div style={styles.itemGrid}>
              {section.items.map((item) => (
                <div key={item.title} style={styles.item}>
                  <h3 style={styles.itemTitle}>{item.title}</h3>
                  <p style={styles.itemText}>{item.text}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}

      <div style={{ ...styles.card, marginTop: 56 }}>
        <p style={styles.cardLabel}>{t.curated_by}</p>
        <p style={styles.cardValue}>{curatorName}</p>
      </div>
      <div style={styles.card}>
        <p style={styles.cardLabel}>{t.source_label}</p>
        <p style={styles.cardValue}>{archiveSource}</p>
      </div>

      <div style={styles.ctaWrap}>
        <Link href="/entries" className="cta-button" style={styles.ctaButton}>
          {t.cta_button}
        </Link>
      </div>
    </main>
  );
}