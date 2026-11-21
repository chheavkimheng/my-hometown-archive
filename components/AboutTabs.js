"use client";

import { useState } from "react";
import translations from "../data/translations.js";
import { useLanguage } from "../context/LanguageContext.js";
import { useScrollReveal } from "../hooks/useScrollReveal.js";

const TABS = ["games", "food"];

const ICONS = {
  games: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <circle cx="9" cy="9" r="1" />
      <circle cx="15" cy="9" r="1" />
      <circle cx="9" cy="15" r="1" />
      <circle cx="15" cy="15" r="1" />
    </>
  ),
  food: <path d="M3 12h18a9 9 0 0 1-18 0zM8 8c0-2 2-2 2-4M14 8c0-2 2-2 2-4" />,
};

export default function AboutTabs() {
  const { lang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;
  const [ref, visible] = useScrollReveal();
  const [tab, setTab] = useState("games");

  // The games and food texts are the second and third sections of the About text.
  const sections = { games: t.about_sections[1], food: t.about_sections[2] };
  const labels = { games: t.tag_games, food: t.tag_food };
  const current = sections[tab];

  return (
    <section ref={ref} className={`about-section fade-in-on-scroll ${visible ? "is-visible" : ""}`}>
      <div className="home-heading-center">
        <h2 className="home-title">{t.about_traditions_heading}</h2>
      </div>

      <div className="seg-wrap">
        <div className="seg" role="tablist">
          {TABS.map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              className={`seg-btn ${tab === key ? "is-active" : ""}`}
              onClick={() => setTab(key)}
            >
              {labels[key]}
            </button>
          ))}
        </div>
      </div>

      <p className="home-intro trad-intro">{current.intro}</p>

      <div key={tab} className="trad-grid" role="tabpanel">
        {current.items.map((item) => (
          <article key={item.title} className="trad-card">
            <div className="trad-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {ICONS[tab]}
              </svg>
            </div>
            <h3 className="trad-title">{item.title}</h3>
            <p className="trad-text">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}