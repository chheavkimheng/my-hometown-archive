"use client";

import Link from "next/link";
import translations from "../data/translations.js";
import { useLanguage } from "../context/LanguageContext.js";

const styles = {
  box: {
    maxWidth: 560,
    padding: 24,
    backgroundColor: "#E6EFE9",
    border: "1px solid #D8DED5",
    borderRadius: 10,
  },
  message: { fontSize: 16, lineHeight: 1.7, margin: "0 0 16px" },
  link: { fontSize: 15, fontWeight: 600, color: "#2D5F4C" },
};

export default function SubmissionNotice() {
  const { lang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;

  return (
    <div role="status" style={styles.box}>
      <p style={styles.message}>{t.submit_waiting_message}</p>
      <Link href="/my-entries" style={styles.link}>
        {t.nav_my_entries}
      </Link>
    </div>
  );
}