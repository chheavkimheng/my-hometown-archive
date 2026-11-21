"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import collection from "../collection.config.js";
import translations from "../data/translations.js";
import { HERO_IMAGES } from "../data/heroImages.js";
import { useLanguage } from "../context/LanguageContext.js";
import HeroSlideshow from "./HeroSlideshow.js";
import Bunting from "./Bunting.js";

const BENEFITS = [
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

// The page shell for log in, sign up and the "you need an account" prompts.
// mode: "login" or "signup" (which tab is lit). showTabs: false for the prompts.
export default function AuthShell({ mode, showTabs = true, icon, title, subtitle, children }) {
  const { lang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;
  const archiveName = lang === "km" ? t.archive_name : collection.name;

  // Keep a ?next=... in the address when switching between the tabs.
  const [search, setSearch] = useState("");
  useEffect(() => {
    setSearch(window.location.search);
  }, []);

  return (
    <main className="auth-stage">
      <HeroSlideshow images={HERO_IMAGES} />
      <div className="auth-shade" />

      <div className="auth-card fade-in-up">
        <aside className="auth-aside">
          <Bunting />
          <div className="auth-aside-body">
            <p className="auth-kicker">{t.hero_kicker}</p>
            <h2 className="auth-brand">{archiveName}</h2>
            <ul className="auth-benefits">
              {BENEFITS.map((benefit) => (
                <li key={benefit.key} className="auth-benefit">
                  <div className="auth-benefit-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {benefit.icon}
                    </svg>
                  </div>
                  <div>
                    <p className="auth-benefit-title">{t[`auth_benefit_${benefit.key}_title`]}</p>
                    <p className="auth-benefit-text">{t[`auth_benefit_${benefit.key}_text`]}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="auth-main">
          {showTabs && (
            <div className="auth-tabs">
              <Link
                href={`/login${search}`}
                className={`auth-tab ${mode === "login" ? "is-active" : ""}`}
                aria-current={mode === "login" ? "page" : undefined}
              >
                {t.nav_login}
              </Link>
              <Link
                href={`/signup${search}`}
                className={`auth-tab ${mode === "signup" ? "is-active" : ""}`}
                aria-current={mode === "signup" ? "page" : undefined}
              >
                {t.nav_signup}
              </Link>
            </div>
          )}
          {icon && <div className="auth-icon">{icon}</div>}
          <h1 className="auth-title">{title}</h1>
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          {children}
          <div className="auth-back-wrap">
            <Link href="/" className="auth-back">
              <span className="auth-back-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M11 6l-6 6 6 6" />
                </svg>
              </span>
              {t.auth_back}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}