"use client";

import Link from "next/link";
import translations from "../data/translations.js";
import { useLanguage } from "../context/LanguageContext.js";

const styles = {
  divider: { borderTop: "1px solid rgba(255, 255, 255, 0.2)", margin: "8px 0" },
  email: {
    padding: "8px 24px",
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  logout: {
    margin: "4px 24px 12px",
    padding: "8px 16px",
    fontSize: 14,
    fontWeight: 600,
    color: "#2D5F4C",
    backgroundColor: "#FFFFFF",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
};

export default function NavMenu({ user, isReviewer, onClose, onLogout }) {
  const { lang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;

  const links = [
    { href: "/", label: t.nav_home },
    { href: "/entries", label: t.nav_entries },
  ];
  if (user) {
    links.push({ href: "/contribute", label: t.nav_contribute ?? "Add entry" });
    links.push({ href: "/my-entries", label: t.nav_my_entries });
    // Politeness, not security: the database decides who can really review.
    if (isReviewer) links.push({ href: "/review", label: t.nav_review });
  }

  return (
    <nav id="site-menu" className="nav-panel">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="nav-panel-link" onClick={onClose}>
          {link.label}
        </Link>
      ))}

      <div style={styles.divider} />

      {user ? (
        <>
          <div style={styles.email}>{user.email}</div>
          <button type="button" onClick={onLogout} style={styles.logout}>
            {t.nav_logout}
          </button>
        </>
      ) : (
        <>
          <Link href="/login" className="nav-panel-link" onClick={onClose}>
            {t.nav_login}
          </Link>
          <Link href="/signup" className="nav-panel-link" onClick={onClose}>
            {t.nav_signup}
          </Link>
        </>
      )}
    </nav>
  );
}