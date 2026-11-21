"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client.js";
import translations from "../../data/translations.js";
import { useLanguage } from "../../context/LanguageContext.js";
import { nextPath } from "../../utils/nextPath.js";
import AuthShell from "../../components/AuthShell.js";
import PasswordField from "../../components/PasswordField.js";

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

    router.push(nextPath());
    router.refresh();
  };

  return (
    <AuthShell mode="signup" title={t.signup_title} subtitle={t.auth_signup_subtitle}>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label className="form-label" htmlFor="email">
            {t.email_label}
          </label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <PasswordField
          id="password"
          label={t.password_label}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          minLength={6}
          hint={t.auth_password_hint}
        />
        {error && (
          <p className="form-alert" role="alert">
            {error}
          </p>
        )}
        <button type="submit" disabled={loading} className="form-submit">
          {loading ? t.signup_button_loading : t.signup_button}
        </button>
      </form>
    </AuthShell>
  );
}