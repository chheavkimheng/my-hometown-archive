"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import collection from "../collection.config.js";
import translations from "../data/translations.js";
import { HERO_IMAGES } from "../data/heroImages.js";
import { createClient } from "../utils/supabase/client.js";
import { useLanguage } from "../context/LanguageContext.js";
import { useScrollReveal } from "../hooks/useScrollReveal.js";
import HeroSlideshow from "../components/HeroSlideshow.js";
import HomeStats from "../components/HomeStats.js";
import HomeDays from "../components/HomeDays.js";
import HomeFeatured from "../components/HomeFeatured.js";

// The photos' shape (width / height). On wide screens the header takes this shape;
// on phones minHeight keeps room for the title and buttons.
const HERO_RATIO = "1376 / 560";

const styles = {
  hero: {
    position: "relative",
    width: "100%",
    aspectRatio: HERO_RATIO,
    minHeight: 440,
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    overflow: "hidden",
    backgroundColor: "#2D5F4C",
  },
  heroShade: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.12) 85%)",
  },
  heroText: {
    position: "relative",
    width: "100%",
    maxWidth: 1100,
    margin: "0 auto",
    padding: "40px 24px 88px",
    textAlign: "center",
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
};

export default function Home() {
  const { lang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;
  const archiveName = lang === "km" ? t.archive_name : collection.name;
  const curatorName = lang === "km" ? t.curator_name : collection.curator;

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quoteRef, quoteVisible] = useScrollReveal();
  const [ctaRef, ctaVisible] = useScrollReveal();

  useEffect(() => {
    let active = true;
    async function loadEntries() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("entries")
        .select("id, slug, title, title_km, description, description_km, place, category, image:photo_url")
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

  return (
    <>
      <section style={styles.hero}>
        <HeroSlideshow images={HERO_IMAGES} />
        <div style={styles.heroShade} />
        <div style={styles.heroText}>
          <p className="fade-in-up" style={styles.kicker}>
            {t.hero_kicker}
          </p>
          <h1 className="fade-in-up" style={styles.title}>
            {archiveName}
          </h1>
          <div className="hero-actions fade-in-up">
            <Link href="/entries" className="hero-btn is-primary">
              {t.cta_button}
            </Link>
            <Link href="/about" className="hero-btn">
              {t.nav_about}
            </Link>
          </div>
        </div>
      </section>

      <div className="home-stats-wrap">
        <HomeStats entryCount={loading ? null : entries.length} />
      </div>

      <main className="page-container">
        <HomeDays />
        <HomeFeatured entries={entries.slice(0, 3)} loading={loading} />
      </main>

      <section
        ref={quoteRef}
        className={`home-quote fade-in-on-scroll ${quoteVisible ? "is-visible" : ""}`}
      >
        <div className="home-quote-inner">
          <span className="home-quote-mark" aria-hidden="true">
            “
          </span>
          <blockquote className="home-quote-text">{t.home_quote}</blockquote>
          <p className="home-quote-by">— {curatorName}</p>
        </div>
      </section>

      <div className="home-cta-wrap">
        <section
          ref={ctaRef}
          className={`home-cta fade-in-on-scroll ${ctaVisible ? "is-visible" : ""}`}
        >
          <h2 className="home-cta-title">{t.home_cta_title}</h2>
          <p className="home-cta-text">{t.home_cta_text}</p>
          <Link href="/contribute" className="btn-primary">
            + {t.my_add_entry}
          </Link>
        </section>
      </div>
    </>
  );
}