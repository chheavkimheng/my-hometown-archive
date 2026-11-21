export default function FormField({ id, label, hint, error, full, children }) {
  return (
    <div className={`form-field ${full ? "full" : ""}`}>
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      {children}
      {error ? (
        <p className="form-error" role="alert">{error}</p>
      ) : (
        hint && <p className="form-hint">{hint}</p>
      )}
    </div>
  );
}