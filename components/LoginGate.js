"use client";

import Link from "next/link";
import AuthShell from "./AuthShell.js";

// Shown instead of a page that needs an account. This is only a friendly prompt:
// the database is what actually keeps logged-out visitors from saving anything.
export default function LoginGate({
  title,
  text,
  primaryHref,
  primaryLabel,
  secondaryText,
  secondaryHref,
  secondaryLabel,
}) {
  const lock = (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );

  return (
    <AuthShell showTabs={false} icon={lock} title={title} subtitle={text}>
      <Link href={primaryHref} className="form-submit auth-cta">
        {primaryLabel}
      </Link>
      <p className="auth-switch">
        {secondaryText} <Link href={secondaryHref}>{secondaryLabel}</Link>
      </p>
    </AuthShell>
  );
}