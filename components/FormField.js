export default function FormField({ id, label, hint, error, full, count, children }) {
  const near = count && count.current >= count.max * 0.9;

  return (
    <div className={`form-field ${full ? "full" : ""}`}>
      <div className="form-label-row">
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
        {count && (
          <span className={`form-count ${near ? "is-near" : ""}`}>
            {count.current} / {count.max}
          </span>
        )}
      </div>
      {children}
      {error ? (
        <p className="form-error" role="alert">{error}</p>
      ) : (
        hint && <p className="form-hint">{hint}</p>
      )}
    </div>
  );
}