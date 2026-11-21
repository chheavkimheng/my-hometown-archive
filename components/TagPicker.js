export default function TagPicker({ options, selected, onToggle, labelFor }) {
  return (
    <div className="chip-row" role="group">
      {options.map((key) => {
        const on = selected.includes(key);
        return (
          <button
            key={key}
            type="button"
            className={`chip ${on ? "is-on" : ""}`}
            aria-pressed={on}
            onClick={() => onToggle(key)}
          >
            {on && <span aria-hidden="true">✓&nbsp;</span>}
            {labelFor(key)}
          </button>
        );
      })}
    </div>
  );
}