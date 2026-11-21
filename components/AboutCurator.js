"use client";

import translations from "../data/translations.js";
import { useLanguage } from "../context/LanguageContext.js";
import { useScrollReveal } from "../hooks/useScrollReveal.js";

export default function AboutCurator({ curatorName, source }) {
  const { lang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;
  const [ref, visible] = useScrollReveal();
  // The first character of the name, which also works for a Khmer name.
  const initial = Array.from(curatorName)[0] ?? "?";

  return (
    <section ref={ref} className={`about-section fade-in-on-scroll ${visible ? "is-visible" : ""}`}>
      <div className="home-heading-center">
        <h2 className="home-title">{t.about_curator_heading}</h2>
      </div>
      <div className="curator">
        <div className="curator-who">
          <div className="curator-avatar" aria-hidden="true">
            {initial}
          </div>
          <div>
            <p className="curator-label">{t.curated_by}</p>
            <h3 className="curator-name">{curatorName}</h3>
          </div>
        </div>
        <blockquote className="curator-source">
          <p className="curator-source-label">{t.source_label}</p>
          <p className="curator-source-text">{source}</p>
        </blockquote>
      </div>
    </section>
  );
}