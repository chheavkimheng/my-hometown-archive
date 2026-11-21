export default function FormSection({ title, children }) {
  return (
    <section className="form-card">
      <h2 className="form-card-title">{title}</h2>
      {children}
    </section>
  );
}