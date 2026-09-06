"use client";

import translations from "../data/translations.js";
import { useLanguage } from "../context/LanguageContext.js";

const styles = {
  footer: {
    backgroundColor: "#2D5F4C",
    color: "#FFFFFF",
    padding: "48px 24px",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 1.6,
  },
};

export default function Footer() {
  const { lang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;

  return <footer style={styles.footer}>{t.footer_credit}</footer>;
}