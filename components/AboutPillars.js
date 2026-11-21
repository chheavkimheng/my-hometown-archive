"use client";

import translations from "../data/translations.js";
import { useLanguage } from "../context/LanguageContext.js";
import { useScrollReveal } from "../hooks/useScrollReveal.js";

const PILLARS = [
  {
    key: "share",
    icon: (
      <>
        <path d="M4 20l4-1 11-11a2.5 2.5 0 0 0-4-4L4 15l-1 4z" />
        <path d="M14 6l4 4" />
      </>
    ),
  },
  {
    key: "review",
    icon: (
      <>
        <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
  {
    key: "khmer",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
      </>
    ),
  },
];

export default function AboutPillars() {
  const { lang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;
  const [ref, visible] = useScrollReveal();

  return (
    <section ref={ref} className={`about-section fade-in-on-scroll ${visible ? "is-visible" : ""}`}>
      <div className="home-heading-center">
        <h2 className="home-title">{t.about_pillars_heading}</h2>
      </div>
      <div className="pillars">
        {PILLARS.map((pillar) => (
          <article key={pillar.key} className="pillar">
            <div className="pillar-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {pillar.icon}
              </svg>
            </div>
            <h3 className="pillar-title">{t[`auth_benefit_${pillar.key}_title`]}</h3>
            <p className="pillar-text">{t[`auth_benefit_${pillar.key}_text`]}</p>
          </article>
        ))}
      </div>
    </section>
  );
}