"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import collection from "../collection.config.js";
import translations from "../data/translations.js";
import { createClient } from "../utils/supabase/client.js";
import { useLanguage } from "../context/LanguageContext.js";
import { useScrollReveal } from "../hooks/useScrollReveal.js";

// The photo behind the title. Change this one line to use another picture from public/.
const HERO_IMAGE = "/images/entry3.jpg";

function truncate(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

const styles = {
  hero: {
    position: "relative",
    minHeight: 380,
    display: "flex",
    alignItems: "flex-end",
    flexShrink: 0,
    overflow: "hidden",
    backgroundColor: "#2D5F4C",
  },
  heroImage: { objectFit: "cover", objectPosition: "center" },
  heroShade: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.2) 70%, rgba(0, 0, 0, 0.1))",
  },
  heroText: {
    position: "relative",
    width: "100%",
    maxWidth: 1100,
    margin: "0 auto",
    padding: "56px 24px",
  },
  kicker: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontStyle: "italic",
    color: "#F6D5C2",
    fontSize: 18,
    margin: 0,
    textShadow: "0 1px 8px rgba(0, 0, 0, 0.5)",
  },
  title: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "clamp(34px, 6vw, 56px)",
    fontWeight: 700,
    margin: "12px 0 0",
    lineHeight: 1.15,
    color: "#FFFFFF",
    textShadow: "0 2px 14px rgba(0, 0, 0, 0.55)",
  },
  featuresSection: {
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
  statusText: {
    fontSize: 15,
    color: "#6B6B63",
  },
};

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

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadEntries() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("entries")
        .select("id, slug, title, description, image:photo_url")
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

  const featuredEntries = entries.slice(0, 3);

  const [ctaRef, ctaVisible] = useScrollReveal();

  let entriesContent;
  if (loading) {
    entriesContent = <p style={styles.statusText}>Loading entries…</p>;
  } else if (featuredEntries.length === 0) {
    entriesContent = <p style={styles.statusText}>{t.no_results}</p>;
  } else {
    entriesContent = (
      <div style={styles.featuresSection}>
        {featuredEntries.map((entry, index) => {
          const km = translations.km[entry.slug];
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
    );
  }

  return (
    <>
      <section style={styles.hero}>
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          style={styles.heroImage}
        />
        <div style={styles.heroShade} />
        <div style={styles.heroText}>
          <p className="fade-in-up" style={styles.kicker}>
            {t.hero_kicker}
          </p>
          <h1 className="fade-in-up" style={styles.title}>
            {archiveName}
          </h1>
        </div>
      </section>

      <main className="page-container">
        {entriesContent}

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
    </>
  );
}