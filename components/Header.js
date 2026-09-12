"use client";

import Link from "next/link";
import collection from "../collection.config.js";
import translations from "../data/translations.js";
import { useLanguage } from "../context/LanguageContext.js";

const styles = {
  header: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    gap: 16,
    padding: "20px 32px",
    backgroundColor: "#2D5F4C",
    color: "#FFFFFF",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  siteName: {
    fontSize: 18,
    fontWeight: 700,
    color: "#FFFFFF",
    textDecoration: "none",
    justifySelf: "start",
  },
  nav: {
    display: "flex",
    gap: 32,
    justifySelf: "center",
  },
  navLink: {
    fontSize: 15,
    color: "#FFFFFF",
    textDecoration: "none",
  },
  langButton: {
    justifySelf: "end",
    display: "flex",
    alignItems: "center",
    padding: "6px 10px",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    border: "1px solid rgba(255, 255, 255, 0.35)",
    borderRadius: 8,
    cursor: "pointer",
  },
};

// Real SVG flags instead of emoji — emoji flags fall back to plain
// two-letter text on Windows/Chrome, which is what showed up as "GB".
function UKFlagIcon() {
  return (
    <svg width="24" height="16" viewBox="0 0 60 40" style={{ display: "block" }}>
      <rect width="60" height="40" fill="#012169" />
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#FFFFFF" strokeWidth="8" />
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 L30,40 M0,20 L60,20" stroke="#FFFFFF" strokeWidth="12" />
      <path d="M30,0 L30,40 M0,20 L60,20" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

function CambodiaFlagIcon() {
  return (
    <svg width="24" height="16" viewBox="0 0 60 40" style={{ display: "block" }}>
      <rect width="60" height="10" fill="#032EA1" />
      <rect y="10" width="60" height="20" fill="#E00025" />
      <rect y="30" width="60" height="10" fill="#032EA1" />
      <g fill="#FFFFFF">
        <rect x="26" y="16" width="8" height="10" />
        <polygon points="30,10 34,16 26,16" />
        <rect x="18" y="19" width="5" height="7" />
        <polygon points="20.5,14 23,19 18,19" />
        <rect x="37" y="19" width="5" height="7" />
        <polygon points="39.5,14 42,19 37,19" />
      </g>
    </svg>
  );
}

export default function Header() {
  const { lang, toggleLang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;
  const siteName = lang === "km" ? t.archive_name : collection.name;

  return (
    <header style={styles.header}>
      <Link href="/" style={styles.siteName}>
        {siteName}
      </Link>

      <nav style={styles.nav}>
        <Link href="/" className="nav-link" style={styles.navLink}>
          {t.nav_home}
        </Link>
        <Link href="/entries" className="nav-link" style={styles.navLink}>
          {t.nav_entries}
        </Link>
      </nav>

      <button
        type="button"
        onClick={toggleLang}
        aria-label={lang === "en" ? "Switch to Khmer" : "Switch to English"}
        style={styles.langButton}
      >
        {lang === "en" ? <CambodiaFlagIcon /> : <UKFlagIcon />}
      </button>
    </header>
  );
}