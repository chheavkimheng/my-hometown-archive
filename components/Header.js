"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import collection from "../collection.config.js";
import translations from "../data/translations.js";
import { useLanguage } from "../context/LanguageContext.js";
import { createClient } from "../utils/supabase/client.js";
import NavMenu from "./NavMenu.js";

const styles = {
  header: {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    alignItems: "center",
    gap: 16,
    padding: "16px 24px",
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
  iconButton: {
    display: "flex",
    alignItems: "center",
    padding: "6px 10px",
    color: "#FFFFFF",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    border: "1px solid rgba(255, 255, 255, 0.35)",
    borderRadius: 8,
    cursor: "pointer",
  },
};

function MenuIcon({ open }) {
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
      {open ? <path d="M3 2l14 12M17 2L3 14" /> : <path d="M2 3h16M2 8h16M2 13h16" />}
    </svg>
  );
}

function USAFlagIcon() {
  return (
    <svg width="24" height="16" viewBox="0 0 60 40" style={{ display: "block" }}>
      <rect width="60" height="40" fill="#B22234" />
      <rect y="3.08" width="60" height="3.08" fill="#FFFFFF" />
      <rect y="9.23" width="60" height="3.08" fill="#FFFFFF" />
      <rect y="15.38" width="60" height="3.08" fill="#FFFFFF" />
      <rect y="21.54" width="60" height="3.08" fill="#FFFFFF" />
      <rect y="27.69" width="60" height="3.08" fill="#FFFFFF" />
      <rect y="33.85" width="60" height="3.08" fill="#FFFFFF" />
      <rect width="24" height="21.54" fill="#3C3B6E" />
      <g fill="#FFFFFF">
        <circle cx="4" cy="3" r="1" />
        <circle cx="9" cy="3" r="1" />
        <circle cx="14" cy="3" r="1" />
        <circle cx="19" cy="3" r="1" />
        <circle cx="6.5" cy="6" r="1" />
        <circle cx="11.5" cy="6" r="1" />
        <circle cx="16.5" cy="6" r="1" />
        <circle cx="4" cy="9" r="1" />
        <circle cx="9" cy="9" r="1" />
        <circle cx="14" cy="9" r="1" />
        <circle cx="19" cy="9" r="1" />
        <circle cx="6.5" cy="12" r="1" />
        <circle cx="11.5" cy="12" r="1" />
        <circle cx="16.5" cy="12" r="1" />
        <circle cx="4" cy="15" r="1" />
        <circle cx="9" cy="15" r="1" />
        <circle cx="14" cy="15" r="1" />
        <circle cx="19" cy="15" r="1" />
        <circle cx="6.5" cy="18" r="1" />
        <circle cx="11.5" cy="18" r="1" />
        <circle cx="16.5" cy="18" r="1" />
      </g>
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
  const router = useRouter();
  const menuButtonRef = useRef(null);
  const closeRef = useRef(null);
  const wasOpen = useRef(false);
  const [user, setUser] = useState(null);
  const [isReviewer, setIsReviewer] = useState(false);
  const [open, setOpen] = useState(false);
  const userId = user?.id;

  useEffect(() => {
    const supabase = createClient();

    supabase.auth
      .getUser()
      .then(({ data }) => {
        setUser(data.user);
      })
      .catch(() => {
        setUser(null);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) {
      setIsReviewer(false);
      return;
    }
    let active = true;

    async function checkReviewer() {
      const supabase = createClient();
      const { data } = await supabase.rpc("is_reviewer");
      if (active) setIsReviewer(data === true);
    }

    checkReviewer();
    return () => {
      active = false;
    };
  }, [userId]);

  // While the menu is open: Escape closes it and the page behind can't scroll.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Keyboard users: focus moves into the menu when it opens,
  // and back to the menu button when it closes.
  useEffect(() => {
    if (open) {
      closeRef.current?.focus();
      wasOpen.current = true;
    } else if (wasOpen.current) {
      menuButtonRef.current?.focus();
      wasOpen.current = false;
    }
  }, [open]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header style={styles.header}>
      <button
        type="button"
        ref={menuButtonRef}
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label={t.menu_open}
        style={styles.iconButton}
      >
        <MenuIcon />
      </button>

      <Link href="/" style={styles.siteName}>
        {siteName}
      </Link>

      <button
        type="button"
        onClick={toggleLang}
        aria-label={lang === "en" ? "Switch to Khmer" : "Switch to English"}
        style={styles.iconButton}
      >
        {lang === "en" ? <CambodiaFlagIcon /> : <USAFlagIcon />}
      </button>

      <div
        className={`nav-overlay ${open ? "is-open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <NavMenu
        open={open}
        closeRef={closeRef}
        user={user}
        isReviewer={isReviewer}
        onClose={() => setOpen(false)}
        onLogout={handleLogout}
      />
    </header>
  );
}