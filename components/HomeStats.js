"use client";

import translations from "../data/translations.js";
import { useLanguage } from "../context/LanguageContext.js";

export default function HomeStats({ entryCount }) {
  const { lang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;

  const stats = [
    { value: entryCount ?? "–", label: t.home_stat_entries },
    { value: 3, label: t.home_stat_days },
    { value: 2, label: t.home_stat_languages },
  ];

  return (
    <div className="home-stats">
      {stats.map((stat) => (
        <div key={stat.label} className="home-stat">
          <p className="home-stat-number">{stat.value}</p>
          <p className="home-stat-label">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}