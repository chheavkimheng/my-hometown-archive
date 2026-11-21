"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import translations from "../data/translations.js";
import { useLanguage } from "../context/LanguageContext.js";

const ICONS = {
  home: <path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10" />,
  entries: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  about: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  add: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  mine: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </>
  ),
  review: (
    <>
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  logout: (
    <>
      <path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4" />
      <path d="M16 8l4 4-4 4M20 12H9" />
    </>
  ),
  login: (
    <>
      <path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4" />
      <path d="M10 8l4 4-4 4M14 12H4" />
    </>
  ),
  signup: (
    <>
      <circle cx="10" cy="8" r="4" />
      <path d="M2 21c0-4 3.5-6 8-6s8 2 8 6M19 7v6M16 10h6" />
    </>
  ),
};

const serif = "Georgia, 'Times New Roman', serif";

const styles = {
  head: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "22px 20px 20px",
  },
  who: { display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 },
  avatar: {
    width: 46,
    height: 46,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: serif,
    fontSize: 20,
    fontWeight: 700,
    color: "#FFFFFF",
    backgroundColor: "#C97B5B",
    borderRadius: "50%",
  },
  whoText: { minWidth: 0 },
  email: {
    fontSize: 17,
    fontWeight: 600,
    lineHeight: 1.3,
    color: "#FFFFFF",
    overflowWrap: "anywhere",
  },
  chip: {
    display: "inline-block",
    marginTop: 6,
    padding: "2px 10px",
    fontSize: 12,
    fontWeight: 600,
    color: "#F6D5C2",
    border: "1px solid rgba(246, 213, 194, 0.55)",
    borderRadius: 999,
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
  account: { marginTop: "auto", padding: "20px 20px 24px" },
  tagline: {
    margin: "8px 0 0",
    textAlign: "center",
    fontFamily: serif,
    fontStyle: "italic",
    fontSize: 15,
    color: "#F6D5C2",
    opacity: 0.85,
  },
};

function Icon({ name }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

function Chevron() {
  return (
    <svg className="nav-panel-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ display: "block" }}>
      <path d="M4 2l12 12M16 2L4 14" />
    </svg>
  );
}

export default function NavMenu({ open, closeRef, user, isReviewer, onClose, onLogout }) {
  const { lang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;
  const pathname = usePathname();

  const links = [
    { href: "/", label: t.nav_home, icon: "home" },
    { href: "/entries", label: t.nav_entries, icon: "entries" },
    { href: "/about", label: t.nav_about, icon: "about" },
  ];
  if (user) {
    links.push({ href: "/contribute", label: t.nav_contribute ?? "Add entry", icon: "add" });
    links.push({ href: "/my-entries", label: t.nav_my_entries, icon: "mine" });
    // Politeness, not security: the database decides who can really review.
    if (isReviewer) links.push({ href: "/review", label: t.nav_review, icon: "review" });
  }

  const isCurrent = (href) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  const initial = (user?.email?.[0] ?? "?").toUpperCase();

  return (
    <nav id="site-menu" className={`nav-drawer ${open ? "is-open" : ""}`}>
      <div style={styles.head}>
        {user && (
          <div style={styles.who}>
            <div style={styles.avatar} aria-hidden="true">
              {initial}
            </div>
            <div style={styles.whoText}>
              <div style={styles.email}>{user.email}</div>
              {isReviewer && <span style={styles.chip}>{t.menu_reviewer}</span>}
            </div>
          </div>
        )}
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

      {links.map((link, index) => (
        <Link
          key={link.href}
          href={link.href}
          className={`nav-panel-link ${isCurrent(link.href) ? "is-current" : ""}`}
          aria-current={isCurrent(link.href) ? "page" : undefined}
          style={{ "--i": index }}
          onClick={onClose}
        >
          <Icon name={link.icon} />
          <span className="nav-panel-label">{link.label}</span>
          <Chevron />
        </Link>
      ))}

      <div style={styles.account}>
        {user ? (
          <button type="button" className="nav-action" onClick={onLogout}>
            <Icon name="logout" />
            {t.nav_logout}
          </button>
        ) : (
          <>
            <Link href="/login" className="nav-action is-primary" onClick={onClose}>
              <Icon name="login" />
              {t.nav_login}
            </Link>
            <Link href="/signup" className="nav-action" onClick={onClose}>
              <Icon name="signup" />
              {t.nav_signup}
            </Link>
          </>
        )}
        <p style={styles.tagline}>{t.hero_kicker}</p>
      </div>
    </nav>
  );
}