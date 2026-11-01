"use client";

import translations from "../data/translations.js";
import { useLanguage } from "../context/LanguageContext.js";

export default function ReviewNotice() {
  const { lang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;

  return (
    <main className="page-container">
      <p>{t.review_not_allowed}</p>
    </main>
  );
}