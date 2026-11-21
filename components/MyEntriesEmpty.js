"use client";

import Link from "next/link";
import translations from "../data/translations.js";
import { useLanguage } from "../context/LanguageContext.js";

const ICONS = {
  ritual: <path d="M12 3c1 3 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3 0-5 1-8z" />,
  food: <path d="M3 12h18a9 9 0 0 1-18 0zM8 8c0-2 2-2 2-4M14 8c0-2 2-2 2-4" />,
  game: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <circle cx="9" cy="9" r="1" />
      <circle cx="15" cy="9" r="1" />
      <circle cx="9" cy="15" r="1" />
      <circle cx="15" cy="15" r="1" />
    </>
  ),
};

function Svg({ size, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

export default function MyEntriesEmpty() {
  const { lang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;

  return (
    <>
      <div className="empty-hero">
        <div className="empty-icon">
          <Svg size={36}>
            <path d="M4 20l4-1 11-11a2.5 2.5 0 0 0-4-4L4 15l-1 4z" />
            <path d="M14 6l4 4" />
          </Svg>
        </div>
        <h2 className="empty-title">{t.my_empty_title}</h2>
        <p className="empty-text">{t.my_empty_text}</p>
        <Link href="/contribute" className="btn-primary">+ {t.my_add_entry}</Link>
      </div>

      <h2 className="section-heading">{t.my_ideas_heading}</h2>
      <div className="idea-grid">
        {["ritual", "food", "game"].map((key) => (
          <Link key={key} href="/contribute" className="idea-card">
            <div className="idea-icon">
              <Svg size={24}>{ICONS[key]}</Svg>
            </div>
            <h3 className="idea-title">{t[`category_${key}`]}</h3>
            <p className="idea-text">{t[`my_idea_${key}`]}</p>
          </Link>
        ))}
      </div>
    </>
  );
}