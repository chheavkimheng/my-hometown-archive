"use client";

import translations from "../data/translations.js";
import { useLanguage } from "../context/LanguageContext.js";
import { useScrollReveal } from "../hooks/useScrollReveal.js";

export default function HomeDays() {
  const { lang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;
  const [ref, visible] = useScrollReveal();
  const section = t.about_sections[0];

  return (
    <section ref={ref} className={`home-section fade-in-on-scroll ${visible ? "is-visible" : ""}`}>
      <div className="home-heading-center">
        <h2 className="home-title">{section.heading}</h2>
        <p className="home-intro">{section.intro}</p>
      </div>
      <div className="days">
        {section.items.map((item, index) => {
          // "Day 1 · Moha Songkran" becomes a small label and a heading.
          const [label, ...rest] = item.title.split(" · ");
          const name = rest.join(" · ") || label;
          return (
            <article key={item.title} className="day-card">
              <div className="day-number">{index + 1}</div>
              <p className="day-label">{label}</p>
              <h3 className="day-name">{name}</h3>
              <p className="day-text">{item.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}