"use client";

import Link from "next/link";
import translations from "../data/translations.js";
import { useLanguage } from "../context/LanguageContext.js";

const styles = {
  head: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "16px 20px 20px",
  },
  email: {
    flex: 1,
    minWidth: 0,
    fontSize: 18,
    fontWeight: 600,
    color: "#FFFFFF",
    overflowWrap: "anywhere",
  },
  closeButton: {
    marginLeft: "auto",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    padding: "6px 10px",
    color: "#FFFFFF",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    border: "1px solid rgba(255, 255, 255, 0.35)",
    borderRadius: 8,
    cursor: "pointer",
  },
  account: {
    marginTop: "auto",
    padding: "0 0 12px",
    borderTop: "1px solid rgba(255, 255, 255, 0.35)",
  },
  logout: {
    margin: "16px 20px 8px",
    padding: "10px 18px",
    fontSize: 16,
    fontWeight: 600,
    color: "#2D5F4C",
    backgroundColor: "#FFFFFF",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
};

function CloseIcon() {
  return (
    <svg
      width="20"
      height="16"
      viewBox="0 0 20 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      style={{ display: "block" }}
    >
      <path d="M4 2l12 12M16 2L4 14" />
    </svg>
  );
}

export default function NavMenu({ open, closeRef, user, isReviewer, onClose, onLogout }) {
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
    <nav id="site-menu" className={`nav-drawer ${open ? "is-open" : ""}`}>
      <div style={styles.head}>
        {user && <div style={styles.email}>{user.email}</div>}
        <button
          type="button"
          ref={closeRef}
          onClick={onClose}
          aria-label={t.menu_close}
          style={styles.closeButton}
        >
          <CloseIcon />
        </button>
      </div>

      {links.map((link) => (
        <Link key={link.href} href={link.href} className="nav-panel-link" onClick={onClose}>
          {link.label}
        </Link>
      ))}

      <div style={styles.account}>
        {user ? (
          <button type="button" onClick={onLogout} style={styles.logout}>
            {t.nav_logout}
          </button>
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
      </div>
    </nav>
  );
}