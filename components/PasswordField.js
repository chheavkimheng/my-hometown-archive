"use client";

import { useState } from "react";
import translations from "../data/translations.js";
import { useLanguage } from "../context/LanguageContext.js";

export default function PasswordField({ id, label, value, onChange, autoComplete, minLength, hint }) {
  const [shown, setShown] = useState(false);
  const { lang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;

  return (
    <div className="form-field">
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <div className="password-wrap">
        <input
          id={id}
          type={shown ? "text" : "password"}
          className="form-control"
          value={value}
          onChange={onChange}
          required
          minLength={minLength}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShown((current) => !current)}
          aria-label={shown ? t.auth_hide_password : t.auth_show_password}
          aria-pressed={shown}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
            <circle cx="12" cy="12" r="3" />
            {shown && <path d="M4 4l16 16" />}
          </svg>
        </button>
      </div>
      {hint && <p className="form-hint">{hint}</p>}
    </div>
  );
}