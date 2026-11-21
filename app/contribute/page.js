"use client";

import { useEffect, useState } from "react";
import EntryForm from "../../components/EntryForm.js";
import LoginGate from "../../components/LoginGate.js";
import { createClient } from "../../utils/supabase/client.js";
import translations from "../../data/translations.js";
import { useLanguage } from "../../context/LanguageContext.js";

const styles = {
  title: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 36,
    fontWeight: 700,
    color: "#2D5F4C",
    margin: "0 0 8px",
  },
  subtitle: { fontSize: 17, color: "#6B6B63", margin: "0 0 28px" },
};

export default function ContributePage() {
  const { lang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setChecked(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!checked) {
    return <main className="page-container" />;
  }

  if (!user) {
    return (
      <LoginGate
        title={t.gate_contribute_title}
        text={t.gate_contribute_text}
        primaryHref="/signup?next=/contribute"
        primaryLabel={t.nav_signup}
        secondaryText={t.have_account_prompt}
        secondaryHref="/login?next=/contribute"
        secondaryLabel={t.nav_login}
      />
    );
  }

  return (
    <main className="page-container">
      <h1 style={styles.title}>{t.contribute_title}</h1>
      <p style={styles.subtitle}>{t.contribute_subtitle}</p>
      <EntryForm />
    </main>
  );
}