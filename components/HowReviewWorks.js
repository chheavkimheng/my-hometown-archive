"use client";

import translations from "../data/translations.js";
import { useLanguage } from "../context/LanguageContext.js";

const STEPS = ["submit", "review", "live"];

export default function HowReviewWorks() {
  const { lang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;

  return (
    <section>
      <h2 className="section-heading">{t.my_review_heading}</h2>
      <div className="steps">
        {STEPS.map((step, index) => (
          <div key={step} className="step">
            <div className="step-number">{index + 1}</div>
            <h3 className="step-title">{t[`my_step_${step}_title`]}</h3>
            <p className="step-text">{t[`my_step_${step}_text`]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}