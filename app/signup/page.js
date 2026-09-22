"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../utils/supabase/client.js";
import translations from "../../data/translations.js";
import { useLanguage } from "../../context/LanguageContext.js";

const styles = {
  wrap: {
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FCFAF5",
    border: "1px solid #D8DED5",
    borderRadius: 16,
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.06)",
    padding: "40px 36px",
  },
  kicker: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontStyle: "italic",
    color: "#C97B5B",
    fontSize: 14,
    margin: "0 0 8px",
  },
  title: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 30,
    fontWeight: 700,
    color: "#2D5F4C",
    margin: "0 0 28px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: 700,
    color: "#2B2B2B",
    marginBottom: 6,
    display: "block",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    fontSize: 16,
    color: "#2B2B2B",
    backgroundColor: "#FFFFFF",
    border: "1px solid #D8DED5",
    borderRadius: 8,
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "13px 24px",
    fontSize: 16,
    fontWeight: 600,
    color: "#FCFAF5",
    border: "none",
    borderRadius: 8,
  },
  error: {
    fontSize: 14,
    color: "#B22234",
    margin: 0,
  },
  switchLink: {
    fontSize: 14,
    color: "#6B6B63",
    marginTop: 24,
    textAlign: "center",
  },
  link: {
    color: "#2D5F4C",
    fontWeight: 600,
    textDecoration: "none",
  },
};

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { lang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (signUpError) {
      setError(t.signup_error);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <main className="page-container">
      <div style={styles.wrap}>
        <div className="fade-in-up" style={styles.card}>
          <p style={styles.kicker}>{t.hero_kicker}</p>
          <h1 style={styles.title}>{t.signup_title}</h1>
          <form style={styles.form} onSubmit={handleSubmit}>
            <div>
              <label style={styles.label} htmlFor="email">
                {t.email_label}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            <div>
              <label style={styles.label} htmlFor="password">
                {t.password_label}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={styles.input}
              />
            </div>
            {error && <p style={styles.error}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="cta-button"
              style={{
                ...styles.button,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? t.signup_button_loading : t.signup_button}
            </button>
          </form>
          <p style={styles.switchLink}>
            {t.have_account_prompt}{" "}
            <Link href="/login" style={styles.link}>
              {t.nav_login}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}