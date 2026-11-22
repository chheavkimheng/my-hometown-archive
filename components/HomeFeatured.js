"use client";

import Link from "next/link";
import translations from "../data/translations.js";
import { useLanguage } from "../context/LanguageContext.js";
import { useScrollReveal } from "../hooks/useScrollReveal.js";
import { localizedEntry } from "../utils/localize.js";
import EntryCard from "./EntryCard.js";

function truncate(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <span className="cta-arrow" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </span>
  );
}

export default function HomeFeatured({ entries, loading }) {
  const { lang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;
  const [ref, visible] = useScrollReveal();

  let body;
  if (loading) {
    body = <div className="spotlight-skeleton skeleton" aria-hidden="true" />;
  } else if (entries.length === 0) {
    body = <p className="home-intro">{t.no_results}</p>;
  } else {
    const [first, ...others] = entries;
    const view = localizedEntry(first, lang);
    body = (
      <>
        <Link href={`/entries/${first.id}`} className="spotlight">
          <div className="spotlight-media">
            {first.image && <img src={first.image} alt={view.title} />}
            <span className="spotlight-badge">{t.home_featured_latest}</span>
          </div>
          <div className="spotlight-body">
            <h3 className="spotlight-title">{view.title}</h3>
            <p className="spotlight-text">{truncate(view.description, 230)}</p>
            {view.place && (
              <p className="spotlight-place">
                <PinIcon />
                {view.place}
              </p>
            )}
            <span className="spotlight-cta">
              {t.home_featured_read}
              <ArrowIcon />
            </span>
          </div>
        </Link>

        {others.length > 0 && (
          <div className="featured-grid">
            {others.map((entry) => {
              const v = localizedEntry(entry, lang);
              return (
                <Link key={entry.id} href={`/entries/${entry.id}`} className="card-link">
                  <EntryCard image={entry.image} title={v.title} description={v.description} place={v.place} badge={entry.category ? t[`category_${entry.category}`] : null} />
                </Link>
              );
            })}
          </div>
        )}
      </>
    );
  }

  return (
    <section ref={ref} className={`home-section fade-in-on-scroll ${visible ? "is-visible" : ""}`}>
      <div className="home-heading-row">
        <div>
          <p className="home-kicker">{t.home_featured_kicker}</p>
          <h2 className="home-title">{t.home_featured_title}</h2>
        </div>
        <Link href="/entries" className="viewall-btn">
          {t.home_featured_all}
          <ArrowIcon />
        </Link>
      </div>
      {body}
    </section>
  );
}