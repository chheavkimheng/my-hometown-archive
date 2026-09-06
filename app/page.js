"use client";

import Link from "next/link";
import collection from "../collection.config.js";
import entries from "../data/entries.js";
import translations from "../data/translations.js";
import { useLanguage } from "../context/LanguageContext.js";
import { useScrollReveal } from "../hooks/useScrollReveal.js";

function truncate(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

const styles = {
  kicker: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontStyle: "italic",
    color: "#C97B5B",
    fontSize: 16,
  },
  title: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 48,
    fontWeight: 700,
    margin: "16px 0 12px",
    lineHeight: 1.15,
    color: "#2D5F4C",
  },
  description: {
    fontSize: 18,
    color: "#6B6B63",
    lineHeight: 1.6,
    margin: 0,
  },
  card: {
    marginTop: 24,
    padding: 24,
    backgroundColor: "#FCFAF5",
    border: "1px solid #D8DED5",
    borderRadius: 10,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "#2D5F4C",
    margin: 0,
  },
  cardValue: {
    fontSize: 16,
    margin: "6px 0 0",
  },
  intro: {
    marginTop: 56,
    paddingTop: 40,
    borderTop: "1px solid #D8DED5",
  },
  introParagraph: {
    fontSize: 16,
    lineHeight: 1.8,
    color: "#2B2B2B",
    marginBottom: 16,
  },
  featuresSection: {
    marginTop: 64,
    display: "flex",
    flexDirection: "column",
    gap: 56,
  },
  featureTitle: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 26,
    fontWeight: 700,
    color: "#2D5F4C",
    margin: "0 0 12px",
  },
  featureExcerpt: {
    fontSize: 16,
    lineHeight: 1.7,
    color: "#2B2B2B",
    margin: 0,
  },
  ctaWrap: {
    marginTop: 56,
  },
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

// Its own component so useScrollReveal gets a fresh, independent hook
// instance per row — calling the hook inside .map() directly would
// break React's rules of hooks.
function FeatureRow({ entryId, entryImage, imageOnRight, displayTitle, displayDescription }) {
  const [rowRef, rowVisible] = useScrollReveal();

  const media = (
    <div className="feature-row-media" key="media">
      {entryImage && <img src={entryImage} alt={displayTitle} />}
    </div>
  );
  const text = (
    <div className="feature-row-text" key="text">
      <h3 style={styles.featureTitle}>{displayTitle}</h3>
      <p style={styles.featureExcerpt}>
        {truncate(displayDescription, 170)}
      </p>
    </div>
  );

  return (
    <Link
      href={`/entries/${entryId}`}
      ref={rowRef}
      className={`feature-row fade-in-on-scroll ${
        rowVisible ? "is-visible" : ""
      }`}
    >
      {imageOnRight ? [text, media] : [media, text]}
    </Link>
  );
}

export default function Home() {
  const { lang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;
  const archiveName = lang === "km" ? t.archive_name : collection.name;
  const archiveDescription =
    lang === "km" ? t.archive_description : collection.description;
  const archiveSource = lang === "km" ? t.archive_source : collection.source;
  const curatorName = lang === "km" ? t.curator_name : collection.curator;
  const featuredEntries = entries.slice(0, 3);

  const [curatedRef, curatedVisible] = useScrollReveal();
  const [sourceRef, sourceVisible] = useScrollReveal();
  const [introRef, introVisible] = useScrollReveal();
  const [ctaRef, ctaVisible] = useScrollReveal();

  return (
    <main className="page-container">
      <p className="fade-in-up" style={styles.kicker}>
        {t.hero_kicker}
      </p>
      <h1 className="fade-in-up" style={styles.title}>
        {archiveName}
      </h1>
      <p className="fade-in-up" style={styles.description}>
        {archiveDescription}
      </p>

      <div
        ref={curatedRef}
        className={`fade-in-on-scroll ${curatedVisible ? "is-visible" : ""}`}
      >
        <div style={styles.card}>
          <p style={styles.cardLabel}>{t.curated_by}</p>
          <p style={styles.cardValue}>{curatorName}</p>
        </div>
      </div>
      <div
        ref={sourceRef}
        className={`fade-in-on-scroll ${sourceVisible ? "is-visible" : ""}`}
      >
        <div style={styles.card}>
          <p style={styles.cardLabel}>{t.source_label}</p>
          <p style={styles.cardValue}>{archiveSource}</p>
        </div>
      </div>

      <div
        ref={introRef}
        className={`fade-in-on-scroll ${introVisible ? "is-visible" : ""}`}
        style={styles.intro}
      >
        {t.landing_intro.map((paragraph, i) => (
          <p key={i} style={styles.introParagraph}>
            {paragraph}
          </p>
        ))}
      </div>

      <div style={styles.featuresSection}>
        {featuredEntries.map((entry, index) => {
          const km = translations.km[entry.id];
          const displayTitle =
            lang === "km" && km?.title ? km.title : entry.title;
          const displayDescription =
            lang === "km" && km?.description
              ? km.description
              : entry.description;
          const imageOnRight = index !== 1;

          return (
            <FeatureRow
              key={entry.id}
              entryId={entry.id}
              entryImage={entry.image}
              imageOnRight={imageOnRight}
              displayTitle={displayTitle}
              displayDescription={displayDescription}
            />
          );
        })}
      </div>

      <div
        ref={ctaRef}
        className={`fade-in-on-scroll ${ctaVisible ? "is-visible" : ""}`}
        style={styles.ctaWrap}
      >
        <Link href="/entries" className="cta-button" style={styles.ctaButton}>
          {t.cta_button}
        </Link>
      </div>
    </main>
  );
}