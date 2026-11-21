import Link from "next/link";

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
  return (
    <div className="gate">
      <div className="gate-icon" aria-hidden="true">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
      </div>
      <h1 className="gate-title">{title}</h1>
      <p className="gate-text">{text}</p>
      <Link href={primaryHref} className="btn-primary">
        {primaryLabel}
      </Link>
      <p className="gate-switch">
        {secondaryText} <Link href={secondaryHref}>{secondaryLabel}</Link>
      </p>
    </div>
  );
}